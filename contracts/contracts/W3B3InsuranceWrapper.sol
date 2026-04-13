// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title W3B3InsuranceWrapper
 * @dev Wraps staked positions with slashing protection by deducting a 
 *      micro-premium dynamically routing to an insurance pool.
 */
contract W3B3InsuranceWrapper is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public stakingToken; // e.g., stETH, W3B3-LP
    
    // The designated insurance fund address (e.g. Nexus Mutual Smart Contract)
    address public insuranceFund; 
    
    // Premium taken upfront or upon yield realization (in basis points: 100 = 1%)
    uint256 public insurancePremiumBp = 100; 

    struct ProtectedPosition {
        uint256 activeBalance;
        uint256 insuredValue;
        uint256 timestamp;
    }

    mapping(address => ProtectedPosition) public positions;

    // Events
    event PositionInsured(address indexed user, uint256 amount, uint256 premiumPaid);
    event PositionUnwrapped(address indexed user, uint256 amount);
    event PremiumUpdated(uint256 newBp);
    event InsuranceFundUpdated(address newFund);

    constructor(
        address _stakingToken, 
        address _insuranceFund,
        address initialOwner
    ) Ownable(initialOwner) {
        require(_stakingToken != address(0), "Invalid staking token");
        require(_insuranceFund != address(0), "Invalid insurance fund");
        
        stakingToken = IERC20(_stakingToken);
        insuranceFund = _insuranceFund;
    }

    /**
     * @dev Wraps a staking token to receive institutional slashing protection.
     * Deducts the insurance premium automatically.
     */
    function wrapAndInsure(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");

        uint256 premiumToPay = (amount * insurancePremiumBp) / 10000;
        uint256 insuredAmount = amount - premiumToPay;

        // Transfer full amount from user
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);
        
        // Route premium to the insurance fund
        stakingToken.safeTransfer(insuranceFund, premiumToPay);

        // Record the protected position
        positions[msg.sender].activeBalance += insuredAmount;
        positions[msg.sender].insuredValue += amount; // The gross value protected
        positions[msg.sender].timestamp = block.timestamp;

        emit PositionInsured(msg.sender, insuredAmount, premiumToPay);
    }

    /**
     * @dev Unwraps and withdraws the protected balance.
     */
    function unwrap(uint256 amount) external nonReentrant {
        ProtectedPosition storage pos = positions[msg.sender];
        require(pos.activeBalance >= amount, "Insufficient active balance");

        pos.activeBalance -= amount;
        
        stakingToken.safeTransfer(msg.sender, amount);
        emit PositionUnwrapped(msg.sender, amount);
    }

    // --- Admin ---

    function setPremium(uint256 _newPremiumBp) external onlyOwner {
        require(_newPremiumBp <= 1000, "Premium too high"); // Max 10%
        insurancePremiumBp = _newPremiumBp;
        emit PremiumUpdated(_newPremiumBp);
    }

    function setInsuranceFund(address _newFund) external onlyOwner {
        require(_newFund != address(0), "Invalid address");
        insuranceFund = _newFund;
        emit InsuranceFundUpdated(_newFund);
    }
}
