# Phase 15 — Runtime Completions & SDK Hardening
## Implementation Spec

**Status: Planned. Begins after Phase 14 merge to main.**
**Prerequisite: `origin/phase-14/production-assurance` merged and CI green.**

---

## Overview

Phase 15 targets every service and SDK method that currently returns a mock, stub, or hardcoded value. The goal is to make all existing features production-callable end-to-end. No new features are introduced — this is a hardening and wiring phase.

---

## Sprint 15.01 — Governance Persistence

**Blocker carry-forward from Phase 14.**

### Tasks

1. Add `GovernanceVote` model to `backend/prisma/schema.prisma`:
   ```prisma
   model GovernanceVote {
     id        String   @id @default(cuid())
     userId    String
     poolId    String
     weight    Int
     createdAt DateTime @default(now())
     user      User     @relation(fields: [userId], references: [id])
     @@map("governance_votes")
   }
   ```
2. Add `governanceVotes` relation to `User` model.
3. Update `GovernanceService.castVote` to persist to `GovernanceVote` table.
4. Add `GET /governance/votes` endpoint to return vote tallies per pool.
5. Wire governance page mandate weight bars to real vote tally reads (replace `Math.random()`).
6. Add `GovernanceService` unit test.

### Acceptance Criteria
- `castVote` writes to DB.
- Mandate weight bars on `/governance` reflect real accumulated vote weights.
- `GET /governance/votes` returns correct tally per pool.

---

## Sprint 15.02 — Revenue Router (1inch v6 Integration)

### Tasks

1. Install `@1inch/sdk` or use direct REST calls to `https://api.1inch.dev/swap/v6.0/1/`.
2. Add `ONEINCH_API_KEY` to `backend/.env.example`.
3. Implement `RevenueRouterService.executeSwapToEth`:
   - Request quote from `/quote` endpoint.
   - Build calldata from `/swap` endpoint.
   - Sign and broadcast via `ethers` provider.
   - Return real tx hash.
4. Add integration test for `harvestFees` with a mock 1inch API response.

### Acceptance Criteria
- `harvestFees` executes real swaps on a forked mainnet Hardhat node.
- Returns real tx hash, not `PLANNING_COMPLETED`.

---

## Sprint 15.03 — Safe SDK Integration

### Tasks

1. Install `@safe-global/protocol-kit` and `@safe-global/api-kit`.
2. Implement `SafeService.proposeInstitutionalStake`:
   - Use `SafeFactory` to load the existing Safe at `safeAddress`.
   - Build a `SafeTransaction` with the encoded staking calldata.
   - Propose via `SafeApiKit.proposeTransaction`.
   - Return real `safeTxHash`.
3. Implement `SafeService.verifySafeTransactionSignatures`:
   - Query `SafeApiKit.getTransaction(safeTxHash)`.
   - Return `confirmations.length >= confirmationsRequired`.
4. Add unit tests with mocked `@safe-global/protocol-kit`.

### Acceptance Criteria
- `proposeInstitutionalStake` returns a real Safe tx hash from the Safe Transaction Service.
- `verifySafeTransactionSignatures` returns correct boolean based on real confirmation count.

---

## Sprint 15.04 — ERC-4337 Paymaster End-to-End

### Tasks

1. Add `ALCHEMY_GAS_POLICY_ID` to `backend/.env.example` with instructions.
2. Write an integration test for `GasService.sponsorUserOperation` using a mock Alchemy response.
3. Document the required Alchemy Gas Manager policy setup in `INSTALL.md`.
4. Verify the `aaService.ts` frontend Account Abstraction flow connects to the backend `GasService`.

### Acceptance Criteria
- `sponsorUserOperation` returns a valid `paymasterAndData` hex string in a test environment.
- `INSTALL.md` documents how to configure the Alchemy Gas Manager policy.

---

## Sprint 15.05 — W3B3 SDK Real Wiring

### Tasks

1. `W3B3SDK.getTopOpportunities` — replace mock array with a real `GET /pools` API call using the SDK's `apiKey` as a Bearer token.
2. `W3B3SDK.executeDeposit` — load `StakingPool` ABI from `@w3b3/shared`, call `stake(amount)` on the contract via the provided `userSigner`.
3. `W3B3SDK.deployCustomVault` — call `StakingPoolFactory.createPool(...)` via the SDK provider.
4. `W3B3SDK.getRecursiveAlpha` — call `GET /recursive/strategies` and return the top strategy.
5. Update `W3B3SDK.test.ts` to cover all four methods with mocked provider and API.

### Acceptance Criteria
- All four SDK methods make real calls (contract or API) with no mock return values.
- SDK test suite passes with mocked dependencies.

---

## Sprint 15.06 — Portfolio Institutional Vault Value

### Tasks

1. In `PortfolioService.getPortfolioSummary`, replace the hardcoded `+15000` mock per executed proposal with a real on-chain balance read:
   - Use `ethers.provider.getBalance(vault.address)` for ETH vaults.
   - For ERC20 vaults, read balances of known treasury assets via `IERC20.balanceOf(vault.address)`.
   - Convert to USD using `PriceService.getPrice`.
2. Add a `vaultBalanceUsd` field to the portfolio summary response.

### Acceptance Criteria
- Portfolio net worth reflects real on-chain vault balances.
- No hardcoded mock values in `portfolioService`.

---

## Sprint 15.07 — Predictive Analytics Real Time-Series

### Tasks

1. Create a scheduled job (cron or `setInterval` in `bootstrap.ts`) that runs `PredictiveAnalyticsService.forecastPoolYield` for all active pools every 6 hours.
2. Persist the result to `PoolAnalytics.historicalTvl` and `PoolAnalytics.historicalPrice` as append-only JSON arrays (cap at 90 days).
3. Remove `Math.random()` from `forecastPoolYield` — use the persisted `PoolAnalytics` data for trend calculation.
4. Update `GET /yield/stats` to return real historical data from `PoolAnalytics`.

### Acceptance Criteria
- `PoolAnalytics` table contains real time-series data after 24 hours of operation.
- `forecastPoolYield` uses persisted data, not random generation.

---

## Sprint 15.08 — Credit Line Chainlink Oracle

**Prerequisite: Phase 14 merged (Chainlink guards already on branch).**

### Tasks

1. Replace `uint256 collateralPriceAsset` mock in `W3B3CreditLine.sol` with a Chainlink `AggregatorV3Interface` price feed.
2. Use the existing phase-14 round completeness and staleness guards.
3. Update constructor to accept `address _priceFeed` instead of `uint256 _mockPrice`.
4. Remove `setMockPrice` admin function.
5. Update `W3B3CreditLine.test.ts` to use a mock Chainlink aggregator.
6. Build the frontend "Borrow" tab in the portfolio view with health factor display.

### Acceptance Criteria
- `W3B3CreditLine` reads price from a real Chainlink feed.
- `setMockPrice` is removed.
- Frontend borrow tab displays health factor and available credit.

---

## Sprint 15.09 — EigenLayer Withdrawal Queue

### Tasks

1. In `W3B3RestakingHub.withdrawRestake`, replace the instant mock withdrawal with a proper withdrawal queue:
   - Record a `WithdrawalRequest` with a `releaseTimestamp = block.timestamp + 7 days`.
   - Add `claimWithdrawal(uint256 requestId)` function that checks `block.timestamp >= releaseTimestamp`.
2. Add `WithdrawalRequest` struct and `withdrawalRequests` mapping.
3. Update `W3B3RestakingHub.test.ts` to cover the 7-day delay.

### Acceptance Criteria
- `withdrawRestake` queues a withdrawal, does not transfer immediately.
- `claimWithdrawal` transfers after 7 days.
- Tests cover both the queue and the claim.

---

## Sprint 15.10 — Leaderboard Referral Link & Skipped Tests

### Tasks

1. Replace `YOUR_CODE_HERE` in `frontend/src/app/leaderboard/page.tsx` with the authenticated user's `referralCode` from `userStore`.
2. Re-enable `backend/tests/unit/poolService.test.js.skipped` — rename to `.test.js` and fix any broken imports.
3. Re-enable `backend/tests/unit/stakeService.test.js.skipped` — rename to `.test.js` and fix any broken imports.

### Acceptance Criteria
- Leaderboard page shows the connected user's real referral code.
- Both previously skipped tests pass in CI.

---

## Phase 15 Completion Criteria

All sprints 15.01–15.10 merged to main with CI green. No service method returns a mock, stub, or hardcoded value in a production code path.
