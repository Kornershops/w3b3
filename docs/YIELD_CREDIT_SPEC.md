# Yield-Backed Credit: Spec & Implementation Status

## 1. Feature Overview

The **Yield-Backed Credit** module allows users to borrow stablecoins against active yield-bearing staking positions without unstaking them. The original blueprint remains focused on capital efficiency while preserving conservative collateral, debt and liquidation controls.

## 2. Acceptance Criteria

- **AC1: Collateralization** ✅ — Users lock yield-bearing tokens as collateral via `W3B3CreditLine.sol`.
- **AC2: Borrowing** ✅ — Users borrow stablecoins up to 50% LTV (`MAX_LTV = 5000` basis points).
- **AC3: Interest Accrual** ✅ — Loans accrue interest at the configured annual rate via `_accrueInterest`.
- **AC4: Yield Offset** ⚠️ — The product concept is defined, but the authoritative on-chain accounting semantics for automatically offsetting borrow interest with collateral yield are not yet approved/implemented. This remains a Phase 14/15 financial-design gate.
- **AC5: Liquidation** ✅ — Liquidation threshold and penalty are enforced by the contract configuration, with regression coverage.
- **AC6: Dashboard (UI)** ⚠️ — Backend credit functionality exists; the production Borrow UI and end-to-end wallet transaction experience remain Phase 15 work.

## 3. Architecture Components

1. **Smart Contract** 🟢 — `W3B3CreditLine.sol` provides collateral deposit, borrow, repay, withdrawal, liquidation and interest accrual.
2. **Oracle Boundary** 🟢 — `IPriceOracle` delegates collateral valuation to an explicit oracle implementation with runtime observation validation.
3. **Backend** 🟢/🟡 — `CreditService` and `CreditPosition` provide application-level credit functionality; full route/service/test reconciliation remains release work.
4. **Frontend** 🟡 — Borrow UI and transaction-state integration remain to be completed.

## 4. Oracle Status

The previous mock-price description is obsolete. `W3B3CreditLine.sol` now consumes an `IPriceOracle` and validates the oracle contract plus observations at configuration and valuation time. Chainlink-compatible infrastructure and adversarial fixtures are present.

**Production gate:** exact feed addresses, network, decimals, freshness/heartbeat policy, deployment configuration and runtime integration still require authoritative production evidence.

## 5. Financial Safety Requirements

Yield offset must not be implemented from an assumed formula. Before AC4 is closed, the project must explicitly define:

- principal and collateral accounting;
- gross and net yield treatment;
- debt and interest accrual interaction;
- negative/zero yield behavior;
- liquidation behavior while yield is pending/accruing;
- timing/oracle observation rules;
- rounding and precision rules;
- insolvency and loss containment behavior.

The approved model must be implemented at the authoritative state-changing boundary and covered by adversarial tests.

## 6. Test Coverage

### Smart Contract Tests

`W3B3CreditLine.test.ts` covers core collateral, borrowing, repayment, withdrawal, liquidation, access-control, amount and oracle-related guards. Fresh execution remains required for release certification.

### Backend Tests

Credit-service route/controller/service reconciliation and dedicated unit coverage remain release-assurance work where gaps exist.

### Frontend Tests

Borrow UI and wallet transaction-state tests remain Phase 15 work.

## 7. Remaining Work

1. Verify production Chainlink feed/network configuration and deployment evidence.
2. Approve and implement AC4 yield-offset accounting semantics.
3. Add adversarial financial-invariant tests for yield, debt, collateral, liquidation and rounding.
4. Build the production Borrow UI with health-factor and available-credit presentation.
5. Complete backend credit-service test/reconciliation coverage.
6. Verify end-to-end wallet transaction states.

## 8. Important Distinction

**Oracle implementation ≠ production oracle deployment.**

**Credit-line implementation ≠ economic solvency certification.**

**Health-factor display/simulation ≠ transaction authorization.**

AC4 remains open until the accounting model is authoritative, implemented and verified.
