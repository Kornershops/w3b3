# Phase 14 — Financial Safety Invariants

## Purpose

Define the invariants that must be demonstrated before the credit-line track can be marked production-ready.

## Oracle invariants

- The configured oracle must be a contract.
- The oracle must return a strictly positive normalized price.
- Observations must not be future-dated.
- Observations must be complete and fresh according to the oracle adapter's configured policy.
- Oracle rotation must validate the replacement before state changes.

## Position invariants

- Borrowing must not permit a position below the protocol's minimum collateral requirement.
- Collateral withdrawal must not reduce a position below its required collateralization threshold.
- Liquidation must only execute against an unhealthy position.
- Liquidation must never seize more collateral than the position contains.
- Debt repayment must not create negative debt state.
- Interest accrual must be monotonic and bounded by elapsed time.

## Verification rule

Implementation is not equivalent to verification. Each invariant requires executable regression coverage and a successful contract test run before the corresponding task is marked verified.

## Current status

Oracle architecture and configuration validation are implemented. CI/test execution remains required before production assurance can be closed. Yield-offset semantics and recursive on-chain execution remain separate open workstreams.
