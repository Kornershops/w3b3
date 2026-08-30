# Phase 15 — Runtime Completions & SDK Hardening
## Implementation Spec

**Status: Planned / Gated.** Phase 15 begins after the production-critical Phase 14 gates are satisfied or explicitly risk-accepted. The Phase 14 hardening code is already merged to `main`; Phase 15 must not repeat work that has already landed.

## Overview

Phase 15 targets remaining service and SDK methods that return mocks, stubs or hardcoded values. The goal is to make the existing blueprint production-callable end-to-end. No new product direction is introduced.

## Sprint 15.01 — Governance Persistence

- Add `GovernanceVote` persistence and the required `User` relation.
- Persist `GovernanceService.castVote`.
- Add `GET /governance/votes` tally endpoint.
- Replace governance UI `Math.random()` mandate weights with real tally reads.
- Add service tests.

**Acceptance:** votes persist, tallies are correct, and mandate UI reflects stored governance data.

## Sprint 15.02 — Revenue Router

- Integrate the approved 1inch v6 execution path.
- Configure `ONEINCH_API_KEY` safely.
- Replace planning-only swap return values with real transaction handling.
- Add fork/integration coverage with controlled API mocks.

**Acceptance:** fee harvesting can produce a real transaction on the supported test/fork environment and no production path returns a planning placeholder.

## Sprint 15.03 — Safe SDK Integration

- Integrate `@safe-global/protocol-kit` / API kit where appropriate.
- Build and propose real Safe transactions.
- Verify confirmation counts from the Safe Transaction Service.
- Add mocked SDK tests plus integration evidence.

**Acceptance:** institutional proposal and confirmation paths use real Safe transaction semantics.

## Sprint 15.04 — ERC-4337 Paymaster

- Configure the approved paymaster/gas policy.
- Integrate `GasService.sponsorUserOperation` with the actual supported provider path.
- Reconcile frontend Account Abstraction flow with backend sponsorship.
- Document required environment and policy configuration.

**Acceptance:** a controlled test environment returns valid sponsorship data and the frontend/backend flow is proven end-to-end.

## Sprint 15.05 — W3B3 SDK Real Wiring

- Replace mocked `getTopOpportunities` with the pools API.
- Wire `executeDeposit` to the staking contract using the SDK signer.
- Wire `deployCustomVault` to the factory contract.
- Wire `getRecursiveAlpha` to the recursive-strategies API.
- Add provider/API mock tests.

**Acceptance:** SDK methods perform real API/contract operations and contain no production-path mock transaction results.

## Sprint 15.06 — Institutional Vault Portfolio Value

- Replace hardcoded institutional-vault values with on-chain balances.
- Support ETH and known ERC20 treasury assets.
- Value assets through the authoritative price service.
- Add `vaultBalanceUsd` and regression coverage.

**Acceptance:** portfolio valuation is derived from actual balances and approved pricing, with no hardcoded monetary value.

## Sprint 15.07 — Predictive Analytics Time-Series

- Persist real pool observations on a controlled schedule.
- Store bounded historical series in `PoolAnalytics`.
- Remove random-value generation from production forecasting.
- Return persisted historical data through the yield-stats API.

**Acceptance:** forecasting is based on persisted observations and operates without `Math.random()` production data fabrication.

## Sprint 15.08 — Credit-Line Product Completion

**Note:** the Phase 14 oracle abstraction/hardening is already on `main`; do not reimplement the old mock-price replacement.

- Verify production Chainlink feed/network configuration and deployment evidence.
- Complete the frontend Borrow experience.
- Display health factor and available credit from authoritative data.
- Integrate wallet transaction states.
- Complete backend credit-service test/reconciliation gaps.

**Acceptance:** the Borrow experience uses the current oracle architecture and exposes verified, clearly labelled credit state.

## Sprint 15.09 — EigenLayer Withdrawal Queue

- Replace instant mock withdrawal with an explicit withdrawal request lifecycle.
- Record release timestamp and request state.
- Add `claimWithdrawal` with the approved release policy.
- Test queue, early-claim rejection and successful claim.

**Acceptance:** withdrawals cannot bypass the approved delay and the lifecycle is auditable.

## Sprint 15.10 — Referral Link & Skipped Tests

- Replace `YOUR_CODE_HERE` with the authenticated user's real referral code.
- Re-enable `poolService.test.js.skipped` after fixing imports/assumptions.
- Re-enable `stakeService.test.js.skipped` after fixing imports/assumptions.

**Acceptance:** real referral data renders and both formerly skipped suites pass.

## Cross-cutting Phase 15 rules

- No mock, random, hardcoded monetary value or planning placeholder may remain in a production execution path.
- External integrations require timeout/error handling, secrets management and controlled integration tests.
- Financial paths require invariant tests and authoritative state sources.
- A test mock may remain in tests; it must not masquerade as production behavior.
- Every sprint must update implementation status and evidence, not merely check off a task.

## Phase 15 Completion Criteria

All ten sprint families are implemented, appropriately tested, integrated, and documented; production-path mocks/stubs are removed or explicitly isolated; CI is green; and no unresolved Phase 14 production-critical gate is being bypassed.
