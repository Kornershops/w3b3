// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "../interfaces/IPriceOracle.sol";

contract MockPriceOracle is IPriceOracle {
    uint256 public price;
    uint256 public updatedAt;

    constructor(uint256 initialPrice) {
        setPrice(initialPrice);
    }

    function setPrice(uint256 newPrice) public {
        require(newPrice > 0, "Price must be > 0");
        price = newPrice;
        updatedAt = block.timestamp;
    }

    function getPrice() external view returns (uint256, uint256) {
        return (price, updatedAt);
    }
}
