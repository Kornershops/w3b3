// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

interface IPriceOracle {
    /**
     * @notice Returns the collateral price normalized to 18 decimals.
     * @return price Positive price with 18 decimals.
     * @return updatedAt Timestamp of the underlying oracle observation.
     */
    function getPrice() external view returns (uint256 price, uint256 updatedAt);
}
