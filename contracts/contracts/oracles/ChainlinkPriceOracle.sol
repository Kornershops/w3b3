// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "../interfaces/IPriceOracle.sol";

interface AggregatorV3Interface {
    function decimals() external view returns (uint8);
    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );
}

/**
 * @title ChainlinkPriceOracle
 * @notice Normalizes a Chainlink feed to 18 decimals and rejects stale/invalid data.
 */
contract ChainlinkPriceOracle is IPriceOracle {
    AggregatorV3Interface public immutable feed;
    uint256 public immutable maxAge;

    error InvalidFeed();
    error InvalidPrice();
    error StalePrice();
    error IncompleteRound();

    constructor(address feedAddress, uint256 maxAgeSeconds) {
        if (feedAddress == address(0) || maxAgeSeconds == 0) revert InvalidFeed();
        feed = AggregatorV3Interface(feedAddress);
        maxAge = maxAgeSeconds;
    }

    function getPrice() external view returns (uint256 price, uint256 updatedAt) {
        (, int256 answer, , uint256 timestamp, uint80 answeredInRound) = feed.latestRoundData();
        if (answer <= 0) revert InvalidPrice();
        if (timestamp == 0 || block.timestamp - timestamp > maxAge) revert StalePrice();
        if (answeredInRound == 0) revert IncompleteRound();

        uint8 feedDecimals = feed.decimals();
        uint256 rawPrice = uint256(answer);

        if (feedDecimals < 18) {
            price = rawPrice * (10 ** (18 - feedDecimals));
        } else if (feedDecimals > 18) {
            price = rawPrice / (10 ** (feedDecimals - 18));
        } else {
            price = rawPrice;
        }

        if (price == 0) revert InvalidPrice();
        return (price, timestamp);
    }
}
