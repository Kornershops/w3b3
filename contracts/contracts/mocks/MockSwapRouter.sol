// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ISwapRouter {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }
    
    function exactInputSingle(ExactInputSingleParams calldata params) external payable returns (uint256 amountOut);
}

contract MockSwapRouter is ISwapRouter {
    address public weth;

    constructor(address _weth) {
        weth = _weth;
    }

    function exactInputSingle(ExactInputSingleParams calldata params) external payable override returns (uint256 amountOut) {
        // Simple mock: Transfer 1 ETH (WETH) for any input
        amountOut = 1e18; 
        
        // Transfer input token from RevenueRouter to mock
        IERC20(params.tokenIn).transferFrom(msg.sender, address(this), params.amountIn);
        
        // Transfer mock output (WETH) to recipient (Distributor)
        IERC20(weth).transfer(params.recipient, amountOut);
        
        return amountOut;
    }
}
