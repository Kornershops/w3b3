// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Interfaces
import "./W3B3PositionNFT.sol";

/**
 * @title W3B3Stablecoin
 * @dev A delta-neutral stablecoin (w3USD) backed by the real yield of W3B3 staking positions.
 * Users can mint w3USD by collateralizing their W3B3PositionNFTs.
 */
contract W3B3Stablecoin is ERC20, Ownable {
    W3B3PositionNFT public positionNFT;

    // Minimum collateralization ratio (e.g., 15000 = 150%)
    uint256 public constant MIN_COLLATERAL_RATIO = 15000; 

    struct CollateralPosition {
        uint256 tokenId;
        uint256 mintedAmount;
    }

    // Maps user address => Array of Collateral Positions
    mapping(address => CollateralPosition[]) public activeCollaterals;

    // Events
    event Minted(address indexed user, uint256 tokenId, uint256 amountMinted);
    event Burned(address indexed user, uint256 tokenId, uint256 amountBurned);

    constructor(
        address _positionNFT,
        address initialOwner
    ) ERC20("W3B3 USD", "w3USD") Ownable(initialOwner) {
        require(_positionNFT != address(0), "Invalid NFT address");
        positionNFT = W3B3PositionNFT(_positionNFT);
    }

    /**
     * @dev Core stablecoin logic: Collateralize a locked staking position NFT to mint w3USD.
     */
    function mintAgainstPosition(uint256 tokenId, uint256 mintAmount) external {
        require(positionNFT.ownerOf(tokenId) == msg.sender, "Must own the position");
        require(mintAmount > 0, "Mint amount must be > 0");

        // Fetch the underlying metadata (i.e. principal value)
        W3B3PositionNFT.PositionMetadata memory metadata = positionNFT.getPositionDetails(tokenId);

        // Simple collateral math: Assume 1 underlying token = $1 roughly for the demo.
        // In production, this requires an oracle fetch for the underlying asset.
        uint256 maxMintable = (metadata.principalAmount * 10000) / MIN_COLLATERAL_RATIO;
        require(mintAmount <= maxMintable, "Insufficient collateralization");

        // Lock the NFT into this contract
        positionNFT.transferFrom(msg.sender, address(this), tokenId);

        // Record the collateral state
        activeCollaterals[msg.sender].push(CollateralPosition({
            tokenId: tokenId,
            mintedAmount: mintAmount
        }));

        // Mint stablecoins to user
        _mint(msg.sender, mintAmount);

        emit Minted(msg.sender, tokenId, mintAmount);
    }

    /**
     * @dev Repays stablecoin balance to unlock and return the underlying NFT.
     */
    function burnToUnlock(uint256 index) external {
        require(index < activeCollaterals[msg.sender].length, "Invalid index");

        CollateralPosition memory col = activeCollaterals[msg.sender][index];
        require(col.mintedAmount > 0, "No active debt");

        // Burn the stablecoins from user
        _burn(msg.sender, col.mintedAmount);

        // Remove the collateral record
        // Swap array element to end and pop
        uint256 lastIndex = activeCollaterals[msg.sender].length - 1;
        activeCollaterals[msg.sender][index] = activeCollaterals[msg.sender][lastIndex];
        activeCollaterals[msg.sender].pop();

        // Release the NFT back to user
        positionNFT.transferFrom(address(this), msg.sender, col.tokenId);

        emit Burned(msg.sender, col.tokenId, col.mintedAmount);
    }
}
