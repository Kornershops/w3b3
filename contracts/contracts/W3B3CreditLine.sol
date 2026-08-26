// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/IPriceOracle.sol";

/**
 * @title W3B3CreditLine
 * @dev Allows users to lock yield-bearing tokens (collateral) to borrow stablecoins.
 *      Collateral valuation is delegated to a normalized 18-decimal price oracle.
 */
contract W3B3CreditLine is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public borrowAsset;
    IERC20 public collateralAsset;
    IPriceOracle public priceOracle;

    uint256 public constant MAX_LTV = 5000;
    uint256 public constant LIQUIDATION_THRESHOLD = 6000;
    uint256 public constant LIQUIDATION_PENALTY = 500;
    uint256 public constant INTEREST_RATE_BP = 200;

    struct Position {
        uint256 collateralAmount;
        uint256 borrowedAmount;
        uint256 lastUpdateTimestamp;
    }

    mapping(address => Position) public positions;

    event CollateralDeposited(address indexed user, uint256 amount);
    event AssetBorrowed(address indexed user, uint256 amount);
    event DebtRepaid(address indexed user, uint256 amount);
    event CollateralWithdrawn(address indexed user, uint256 amount);
    event Liquidated(address indexed user, address indexed liquidator, uint256 debtRepaid, uint256 collateralLiquidated);
    event PriceOracleUpdated(address indexed previousOracle, address indexed newOracle);

    error InvalidOracle();
    error InvalidOraclePrice();

    constructor(
        address _borrowAsset,
        address _collateralAsset,
        address _priceOracle,
        address initialOwner
    ) Ownable(initialOwner) {
        if (_borrowAsset == address(0) || _collateralAsset == address(0) || _priceOracle == address(0)) {
            revert InvalidOracle();
        }

        borrowAsset = IERC20(_borrowAsset);
        collateralAsset = IERC20(_collateralAsset);
        priceOracle = IPriceOracle(_priceOracle);
    }

    function depositCollateral(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        collateralAsset.safeTransferFrom(msg.sender, address(this), amount);

        Position storage pos = positions[msg.sender];
        _accrueInterest(msg.sender);
        pos.collateralAmount += amount;

        emit CollateralDeposited(msg.sender, amount);
    }

    function borrow(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");

        Position storage pos = positions[msg.sender];
        _accrueInterest(msg.sender);
        pos.borrowedAmount += amount;

        uint256 collateralValue = _collateralValue(pos.collateralAmount);
        uint256 maxBorrow = (collateralValue * MAX_LTV) / 10000;
        require(pos.borrowedAmount <= maxBorrow, "LTV exceeded");

        borrowAsset.safeTransfer(msg.sender, amount);
        emit AssetBorrowed(msg.sender, amount);
    }

    function repay(uint256 amount) external nonReentrant {
        Position storage pos = positions[msg.sender];
        _accrueInterest(msg.sender);

        uint256 repayAmount = amount > pos.borrowedAmount ? pos.borrowedAmount : amount;
        require(repayAmount > 0, "No debt to repay");

        pos.borrowedAmount -= repayAmount;
        borrowAsset.safeTransferFrom(msg.sender, address(this), repayAmount);
        emit DebtRepaid(msg.sender, repayAmount);
    }

    function withdrawCollateral(uint256 amount) external nonReentrant {
        Position storage pos = positions[msg.sender];
        _accrueInterest(msg.sender);

        require(pos.collateralAmount >= amount, "Insufficient collateral");
        pos.collateralAmount -= amount;

        if (pos.borrowedAmount > 0) {
            uint256 newMaxBorrow = (_collateralValue(pos.collateralAmount) * MAX_LTV) / 10000;
            require(pos.borrowedAmount <= newMaxBorrow, "LTV exceeded after withdrawal");
        }

        collateralAsset.safeTransfer(msg.sender, amount);
        emit CollateralWithdrawn(msg.sender, amount);
    }

    function liquidate(address user, uint256 debtToCover) external nonReentrant {
        Position storage pos = positions[user];
        _accrueInterest(user);

        uint256 collateralValue = _collateralValue(pos.collateralAmount);
        uint256 maxAllowedDebt = (collateralValue * LIQUIDATION_THRESHOLD) / 10000;
        require(pos.borrowedAmount > maxAllowedDebt, "Position is healthy");

        uint256 actualDebtToCover = debtToCover > pos.borrowedAmount ? pos.borrowedAmount : debtToCover;
        uint256 price = _price();
        uint256 collateralToSeize = (actualDebtToCover * 1e18) / price;
        uint256 penalty = (collateralToSeize * LIQUIDATION_PENALTY) / 10000;
        uint256 totalCollateralToSeize = collateralToSeize + penalty;

        if (totalCollateralToSeize > pos.collateralAmount) {
            totalCollateralToSeize = pos.collateralAmount;
        }

        pos.borrowedAmount -= actualDebtToCover;
        pos.collateralAmount -= totalCollateralToSeize;

        borrowAsset.safeTransferFrom(msg.sender, address(this), actualDebtToCover);
        collateralAsset.safeTransfer(msg.sender, totalCollateralToSeize);
        emit Liquidated(user, msg.sender, actualDebtToCover, totalCollateralToSeize);
    }

    function setPriceOracle(address newOracle) external onlyOwner {
        if (newOracle == address(0)) revert InvalidOracle();
        address previousOracle = address(priceOracle);
        priceOracle = IPriceOracle(newOracle);
        emit PriceOracleUpdated(previousOracle, newOracle);
    }

    function _price() internal view returns (uint256 price) {
        (price, ) = priceOracle.getPrice();
        if (price == 0) revert InvalidOraclePrice();
    }

    function _collateralValue(uint256 collateralAmount) internal view returns (uint256) {
        return (collateralAmount * _price()) / 1e18;
    }

    function _accrueInterest(address user) internal {
        Position storage pos = positions[user];
        if (pos.borrowedAmount > 0 && pos.lastUpdateTimestamp > 0) {
            uint256 timeElapsed = block.timestamp - pos.lastUpdateTimestamp;
            uint256 interest = (pos.borrowedAmount * INTEREST_RATE_BP * timeElapsed) / (10000 * 365 days);
            pos.borrowedAmount += interest;
        }
        pos.lastUpdateTimestamp = block.timestamp;
    }
}
