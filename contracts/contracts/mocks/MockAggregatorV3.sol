// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract MockAggregatorV3 {
    uint8 public immutable decimals;
    int256 public answer;
    uint256 public updatedAt;
    uint80 public answeredInRound;

    constructor(uint8 feedDecimals, int256 initialAnswer) {
        decimals = feedDecimals;
        setAnswer(initialAnswer);
    }

    function setAnswer(int256 newAnswer) public {
        answer = newAnswer;
        updatedAt = block.timestamp;
        answeredInRound += 1;
    }

    function setUpdatedAt(uint256 timestamp) external {
        updatedAt = timestamp;
    }

    function setRound(uint80 round) external {
        answeredInRound = round;
    }

    function latestRoundData()
        external
        view
        returns (uint80, int256, uint256, uint256, uint80)
    {
        return (answeredInRound, answer, updatedAt, updatedAt, answeredInRound);
    }
}
