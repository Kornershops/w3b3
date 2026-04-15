# Liquidity Provisioning Guide (W3B3 / ETH)

To launch the Real Yield ecosystem officially, W3B3 requires a public market price. This is achieved by creating an initial Liquidity Pool (LP) against Ethereum (WETH). 

This guide instructs the Admin on how to supply the Protocol-Owned Liquidity.

## 1. Prerequisites
- The final `$W3B3` ERC20 token deployed.
- Admin wallet funded with Ethereum (ETH) which will serve as the price floor.
- Access to **Uniswap V3** interface.

## 2. Pool Configuration (Uniswap V3)
- **Pair**: `$W3B3` / `$WETH`
- **Fee Tier**: `0.3%` (Standard for most volatile pairs)
- **Starting Price**: *Determined by initial protocol valuation*
  *(Example: 1 W3B3 = 0.0001 ETH)*

## 3. Deployment Steps
1. Navigate to the [Uniswap V3 Add Liquidity Interface](https://app.uniswap.org/#/add).
2. Select **ETH** as the quote token.
3. Paste the custom contract address of `$W3B3`.
4. Select the **0.3% fee tier**.
5. **Set the Initial Price**: Ensure the mathematical ratio matches the intended FDV (Fully Diluted Valuation) of the project.
6. **Set the Price Range**: For initial launch, it is recommended to set a wide range (Full Range) to ensure trades can happen at any amplitude before concentrating liquidity later.
7. Approve the `$W3B3` token contract.
8. Click **Preview** -> **Add**.

## 4. Post-Deployment Verification
- **CoinGecko / DexTools**: Once the transaction confirms, the pool will automatically be indexed by DexTools and DexScreener within minutes.
- **Contract Verification**: Use the assigned LP contract address to confirm that `RevenueRouter` has sufficient liquidity depth to swap protocol fees without excessive slippage.

## 5. Security & Trust
- **LP Token Locking**: To generate user trust, the LP NFT minted from Uniswap V3 should be locked in an industry-standard locker (e.g., Team Finance, Uncx) for minimum 12 months. This mitigates "rug-pull" fears.
