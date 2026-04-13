// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title W3B3CreditLine
 * @dev Allows users to lock yield-bearing tokens (collateral) to borrow stablecoins.
 */
contract W3B3CreditLine is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // --- State Variables ---

    IERC20 public borrowAsset; // e.g., USDC
    IERC20 public collateralAsset; // e.g., stETH or LP token

    uint256 public constant MAX_LTV = 5000; // 50% (basis points)
    uint256 public constant LIQUIDATION_THRESHOLD = 6000; // 60%
    uint256 public constant LIQUIDATION_PENALTY = 500; // 5% bonus for liquidators
    uint256 public constant INTEREST_RATE_BP = 200; // 2% annual fixed borrow rate

    // Mock price oracle for simplicity in this phase
    uint256 public collateralPriceAsset; 

    struct Position {
        uint256 collateralAmount;
        uint256 borrowedAmount;
        uint256 lastUpdateTimestamp;
    }

    mapping(address => Position) public positions;

    // --- Events ---
    event CollateralDeposited(address indexed user, uint256 amount);
    event AssetBorrowed(address indexed user, uint256 amount);
    event DebtRepaid(address indexed user, uint256 amount);
    event CollateralWithdrawn(address indexed user, uint256 amount);
    event Liquidated(address indexed user, address indexed liquidator, uint256 debtRepaid, uint256 collateralLiquidated);

    constructor(
        address _borrowAsset,
        address _collateralAsset,
        uint256 _mockPrice,
        address initialOwner
    ) Ownable(initialOwner) {
        require(_borrowAsset != address(0), "Invalid borrow asset");
        require(_collateralAsset != address(0), "Invalid collateral asset");
        
        borrowAsset = IERC20(_borrowAsset);
        collateralAsset = IERC20(_collateralAsset);
        collateralPriceAsset = _mockPrice;
    }

    // --- Core Functions ---

    /**
     * @dev Deposit collateral into the protocol.
     */
    function depositCollateral(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        
        collateralAsset.safeTransferFrom(msg.sender, address(this), amount);
        
        Position storage pos = positions[msg.sender];
        _accrueInterest(msg.sender);
        
        pos.collateralAmount += amount;
        
        emit CollateralDeposited(msg.sender, amount);
    }

    /**
     * @dev Borrow stablecoins against the deposited collateral.
     */
    function borrow(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        
        Position storage pos = positions[msg.sender];
        _accrueInterest(msg.sender);
        
        pos.borrowedAmount += amount;
        
        // Check health factor
        uint256 collateralValue = (pos.collateralAmount * collateralPriceAsset) / 1e18;
        uint256 maxBorrow = (collateralValue * MAX_LTV) / 10000;
        require(pos.borrowedAmount <= maxBorrow, "LTV exceeded");
        
        borrowAsset.safeTransfer(msg.sender, amount);
        
        emit AssetBorrowed(msg.sender, amount);
    }

    /**
     * @dev Repay borrowed assets.
     */
    function repay(uint256 amount) external nonReentrant {
        Position storage pos = positions[msg.sender];
        _accrueInterest(msg.sender);
        
        uint256 repayAmount = amount > pos.borrowedAmount ? pos.borrowedAmount : amount;
        require(repayAmount > 0, "No debt to repay");
        
        pos.borrowedAmount -= repayAmount;
        borrowAsset.safeTransferFrom(msg.sender, address(this), repayAmount);
        
        emit DebtRepaid(msg.sender, repayAmount);
    }

    /**
     * @dev Withdraw collateral, provided the health factor is maintained.
     */
    function withdrawCollateral(uint256 amount) external nonReentrant {
        Position storage pos = positions[msg.sender];
        _accrueInterest(msg.sender);
        
        require(pos.collateralAmount >= amount, "Insufficient collateral");
        
        pos.collateralAmount -= amount;
        
        if (pos.borrowedAmount > 0) {
            uint256 newCollateralValue = (pos.collateralAmount * collateralPriceAsset) / 1e18;
            uint256 newMaxBorrow = (newCollateralValue * MAX_LTV) / 10000;
            require(pos.borrowedAmount <= newMaxBorrow, "LTV exceeded after withdrawal");
        }
        
        collateralAsset.safeTransfer(msg.sender, amount);
        emit CollateralWithdrawn(msg.sender, amount);
    }

    /**
     * @dev Liquidate a position that has exceeded the liquidation threshold.
     */
    function liquidate(address user, uint256 debtToCover) external nonReentrant {
        Position storage pos = positions[user];
        _accrueInterest(user);
        
        uint256 collateralValue = (pos.collateralAmount * collateralPriceAsset) / 1e18;
        uint256 maxAllowedDebt = (collateralValue * LIQUIDATION_THRESHOLD) / 10000;
        
        require(pos.borrowedAmount > maxAllowedDebt, "Position is healthy");
        
        uint256 actualDebtToCover = debtToCover > pos.borrowedAmount ? pos.borrowedAmount : debtToCover;
        
        // Calculate collateral to seize
        uint256 collateralToSeize = (actualDebtToCover * 1e18) / collateralPriceAsset;
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

    // --- Internal Helpers ---
    
    function _accrueInterest(address user) internal {
        Position storage pos = positions[user];
        if (pos.borrowedAmount > 0 && pos.lastUpdateTimestamp > 0) {
            uint256 timeElapsed = block.timestamp - pos.lastUpdateTimestamp;
            uint256 interest = (pos.borrowedAmount * INTEREST_RATE_BP * timeElapsed) / (10000 * 365 days);
            pos.borrowedAmount += interest;
        }
        pos.lastUpdateTimestamp = block.timestamp;
    }

    // --- Admin ---
    function setMockPrice(uint256 _newPrice) external onlyOwner {
        collateralPriceAsset = _newPrice;
    }
}
