// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title W3Token
 * @notice Liquid Staking Receipt Token for W3B3 Platform 
 * @dev Minter role is strictly relegated to protocol Staking Pools allowing safe cross-chain wrapping.
 */
contract W3Token is ERC20, Ownable {
    mapping(address => bool) public isPool;

    event PoolStatusUpdated(address indexed pool, bool status);

    constructor() ERC20("W3B3 Liquid Staked Receipt", "w3TOKEN") Ownable(msg.sender) {}

    modifier onlyPool() {
        require(isPool[msg.sender], "W3B3: Not an authorized Staking Pool");
        _;
    }

    /**
     * @notice Add or remove an authorized staking pool 
     * @param pool Address of the pool contract
     * @param status Active state boolean
     */
    function setPoolStatus(address pool, bool status) external onlyOwner {
        isPool[pool] = status;
        emit PoolStatusUpdated(pool, status);
    }

    /**
     * @notice Mint receipts equivalent to user stakes
     * @param to Target wallet
     * @param amount Token volume matching underlying deposits
     */
    function mint(address to, uint256 amount) external onlyPool {
        _mint(to, amount);
    }

    /**
     * @notice Burn receipts explicitly upon withdraw
     * @param from Staker wallet
     * @param amount Tokens representing withdrawal sizing
     */
    function burn(address from, uint256 amount) external onlyPool {
        _burn(from, amount);
    }
}
