// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {ISwapRouter} from "../interfaces/ISwapRouter.sol";


contract MockSwapRouter is ISwapRouter {
    address public weth;

    constructor(address _weth) {
        weth = _weth;
    }

    function exactInputSingle(ExactInputSingleParams calldata params) external payable override returns (uint256 amountOut) {
        // Simple mock: Transfer 1:1 for any input
        amountOut = params.amountIn; 
        
        // Transfer input token from RevenueRouter to mock
        IERC20(params.tokenIn).transferFrom(msg.sender, address(this), params.amountIn);
        
        // Transfer mock output (WETH) to recipient (Distributor)
        IERC20(weth).transfer(params.recipient, amountOut);
        
        return amountOut;
    }
}
