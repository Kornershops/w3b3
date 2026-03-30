// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./MockToken.sol";

contract ERC20Mock is MockToken {
    constructor() MockToken("Mocking Token", "MCK", 1000000 * 10**18) {}
}
