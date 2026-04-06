// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {StakingPool} from "./StakingPool.sol";

/**
 * @title StakingPoolFactory
 * @notice Centralized Registry and Deployer for W3B3 staking pools
 */
contract StakingPoolFactory is Ownable {
    address[] public pools;
    mapping(address => bool) public isDeployedByFactory;

    event PoolCreated(address indexed pool, address indexed stakingToken, address rewardToken);

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Deploy a new Pausable Staking pool autonomously 
     */
    function createPool(
        address _stakingToken,
        address _rewardToken,
        address _w3TokenAddress,
        address _treasuryAddress,
        uint256 _rewardRate
    ) external onlyOwner returns (address) {
        
        StakingPool newPool = new StakingPool(
            _stakingToken,
            _rewardToken,
            _w3TokenAddress,
            _treasuryAddress,
            _rewardRate
        );

        address poolAddress = address(newPool);
        
        // Pass administrative ownership down from factory
        newPool.transferOwnership(msg.sender);

        pools.push(poolAddress);
        isDeployedByFactory[poolAddress] = true;

        emit PoolCreated(poolAddress, _stakingToken, _rewardToken);
        
        return poolAddress;
    }

    /**
     * @notice Retrieve the exact number of active pools
     */
    function getPoolCount() external view returns (uint256) {
        return pools.length;
    }

    /**
     * @notice Retrieve a specific pool index
     */
    function getPoolAddress(uint256 _index) external view returns (address) {
        require(_index < pools.length, "Index out of bounds");
        return pools[_index];
    }
}
