# Yield-Offset Credit — Accounting Proposal

**Status:** PROPOSAL ONLY / NOT APPROVED FOR PRODUCTION
**Phase:** 14 Production Assurance / P0-4
**Authority:** Product + financial/risk approval required before implementation

## Purpose

This document converts the existing Yield-Offset Credit gate into a reviewable accounting proposal. It does **not** authorize an economic model, change smart-contract behavior, or certify solvency.

The current `CreditPosition` persistence model records collateral and borrowed amounts, but does not contain an authoritative yield-offset ledger. The existing credit service also contains a mock initial health factor and therefore is not an economic source of truth. These facts must not be bypassed by implementing an assumed offset formula.

## Proposed conservative semantics for approval

The following is a candidate model for explicit approval, not an accepted requirement:

1. **Principal:** Original borrowed principal is immutable for accounting purposes except through an actual repayment or an explicitly approved debt-adjustment transaction.
2. **Debt:** Accrued debt is separated conceptually into principal and accrued interest. Yield offset must never silently reduce principal.
3. **Eligible yield:** Only yield that has been authoritatively realized/credited by the underlying yield position should become eligible for offset. Estimated APY must not create spendable credit.
4. **Offset cap:** Eligible yield may offset accrued interest only, capped at the outstanding accrued-interest amount. Any excess remains unallocated yield unless a separate product rule is approved.
5. **Negative/zero yield:** Zero yield creates no offset. Losses or negative performance must not create a credit balance or reduce debt below the approved floor.
6. **Liquidation:** Pending/unrealized yield must not be treated as collateral or debt repayment during liquidation. Liquidation uses the authoritative collateral/debt state at the defined observation boundary.
7. **Timing:** Every eligible-yield event requires a deterministic observation timestamp/block boundary and an authoritative source. Reprocessing the same event must be idempotent.
8. **Rounding:** Calculations must use integer/fixed-point arithmetic with an explicitly approved scale. Rounding direction must be conservative for the protocol and documented per operation.
9. **Loss containment:** Yield-offset accounting must never make a position appear healthier than the authoritative collateral/debt valuation. Insolvency and liquidation checks remain independent safety boundaries.
10. **Authorization:** Backend simulation, APY estimates and dashboard values are informational. Only the authoritative state-changing boundary may apply an offset.

## Required approval decisions

Before implementation, Product + Financial/Risk authority must explicitly approve or reject:

- whether yield offsets interest only or may also affect principal;
- whether gross, net-of-fees, or net-of-loss yield is eligible;
- the exact realization event/source for yield;
- treatment of unclaimed rewards;
- treatment of slashing, depeg, withdrawal loss and negative yield;
- whether offset is immediate, periodic, or user-triggered;
- liquidation ordering between yield realization, interest accrual and collateral seizure;
- fixed-point scales, rounding direction and dust handling;
- duplicate-event/idempotency rules;
- whether excess eligible yield is retained, paid out, or applied elsewhere;
- the authoritative on-chain/backend accounting boundary.

## Implementation boundary

No production implementation should be merged as an accepted AC4 implementation until the approval decisions above are recorded. Once approved, the implementation must introduce an auditable ledger/state transition rather than deriving an offset from a displayed APY or mutable dashboard value.

## Test requirements after approval

At minimum, adversarial tests must cover:

- zero yield;
- positive yield below accrued interest;
- positive yield above accrued interest;
- repeated/duplicate yield events;
- rounding and dust;
- interest accrual immediately before/after yield realization;
- repayment immediately before/after offset;
- liquidation while yield is pending;
- negative performance/loss;
- stale or unavailable yield observations;
- authorization attempts through simulation/backend paths;
- invariant that offset cannot reduce principal unless explicitly approved;
- invariant that offset cannot make an undercollateralized position appear safely collateralized without authoritative state transition.

## Non-goals

This proposal does not select an oracle, define production APY sources, authorize a credit limit, or replace the existing oracle/health-factor controls. It also does not constitute financial, legal, accounting, or regulatory approval.
