// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title W3B3PositionNFT
 * @dev Represents a locked staking position as a tradable ERC721 NFT.
 * This introduces "Secondary Liquidity Markets" by allowing users to sell
 * their locked yield (and principal) without waiting for unstake periods.
 */
contract W3B3PositionNFT is ERC721Enumerable, Ownable {
    uint256 private _nextTokenId;

    // The core pool contract allowed to mint these positions
    address public stakingPool;

    struct PositionMetadata {
        uint256 principalAmount;
        address underlyingAsset;
        uint256 lockedUntil;
        uint256 apyAtMint;
    }

    mapping(uint256 => PositionMetadata) public positions;

    // Events
    event PositionMinted(address indexed owner, uint256 indexed tokenId, uint256 principalAmount, uint256 lockedUntil);
    event StakingPoolUpdated(address indexed newPool);

    modifier onlyStakingPool() {
        require(msg.sender == stakingPool, "Only staking pool can mint");
        _;
    }

    constructor(address initialOwner) ERC721("W3B3 Locked Staking Position", "W3B3-POS") Ownable(initialOwner) {
        _nextTokenId = 1; // Start counting from 1
    }

    /**
     * @dev Mints a new NFT representing a locked staking position.
     * Can only be called by the official Staking Pool contract.
     */
    function mintPosition(
        address to, 
        uint256 principalAmount, 
        address underlyingAsset,
        uint256 lockedUntil,
        uint256 apyAtMint
    ) external onlyStakingPool returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        
        positions[tokenId] = PositionMetadata({
            principalAmount: principalAmount,
            underlyingAsset: underlyingAsset,
            lockedUntil: lockedUntil,
            apyAtMint: apyAtMint
        });

        _safeMint(to, tokenId);
        
        emit PositionMinted(to, tokenId, principalAmount, lockedUntil);

        return tokenId;
    }

    /**
     * @dev Retrieves the core metadata details of a specific position NFT.
     */
    function getPositionDetails(uint256 tokenId) external view returns (PositionMetadata memory) {
        // requireOwner is internal from openzeppelin 5.x. We use explicit check or just rely on mappings returning 0 
        // if it doesn't exist. To be safe, verify the owner exists.
        require(ownerOf(tokenId) != address(0), "Position does not exist");
        return positions[tokenId];
    }

    // --- Admin ---

    /**
     * @dev Updates the authorized staking pool capable of minting positions.
     */
    function setStakingPool(address _newPool) external onlyOwner {
        require(_newPool != address(0), "Invalid address");
        stakingPool = _newPool;
        emit StakingPoolUpdated(_newPool);
    }
}
