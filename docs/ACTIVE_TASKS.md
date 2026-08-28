# W3B3 Active Tasks — Sprint 14.08

## Phase 14 — Production Security & Financial Safety

**Status:** ACTIVE / GATED  
**Working branch:** `phase-14/production-assurance`  
**Phase 15:** GATED

### Completed implementation tasks

- [x] Established Phase 14 production-assurance execution branch and sprint tracking.
- [x] Converted the production dependency audit into a hard CI release gate.
- [x] Added recursive authentication/input validation.
- [x] Added recursive strategy maximum-leverage enforcement.
- [x] Added recursive controller regression coverage through the backend's real Jest discovery path.
- [x] Corrected the recursive test mock-isolation defect exposed by CI.
- [x] Replaced credit-line mock price storage with an explicit `IPriceOracle` dependency.
- [x] Added Chainlink price adapter with 18-decimal normalization.
- [x] Added stale, future-timestamp, invalid-price and incomplete-round rejection.
- [x] Added Chainlink `answeredInRound < roundId` protection.
- [x] Added contract-code validation so EOAs/non-contracts cannot be configured as the oracle.
- [x] Added live observation validation when constructing or rotating the credit-line oracle.
- [x] Added runtime oracle observation validation on every collateral valuation/price read.
- [x] Added deterministic oracle/feed fixtures and adversarial configuration tests.
- [x] Added regression coverage for oracle failures occurring after a previously valid configuration.
- [x] Migrated credit-line tests to the oracle architecture.
- [x] Added deployment preflight/configuration requirements for the production oracle path.
- [x] Added explicit Phase 14 financial safety invariants for oracle and position behavior.
- [x] Added credit-line regression coverage for LTV, withdrawal, repayment, liquidation and interest invariants.
- [x] Added credit-line access-control and zero-amount regression coverage.
- [x] Added generic oracle observation regression coverage for valuation-time invalid observations.
- [x] Added a dependency-security baseline documenting the current manifest/lockfile state and remediation policy.
- [x] Added a Sprint 14.08 execution ledger separating implementation completion from verification gates.
- [x] Refreshed the next-sprint execution plan around the remaining production blockers.

### Remaining / carried forward

#### P0 — Production blockers

- [ ] **Dependency security remediation** — generate a reproducible audit, resolve/mitigate confirmed high/critical production findings by compatible dependency families, regenerate authoritative lockfiles, and verify. Do not use blind `npm audit fix --force`.
- [ ] **Production credit oracle verification** — implementation is advanced; remaining approved feed/network configuration, deployment evidence and fresh CI/adversarial integration evidence.
- [ ] **Yield-offset credit** — establish authoritative requirements, implement the intended model, and prove financial invariants. No financial semantics should be invented.
- [ ] **Recursive execution safety** — prove the 1.12 health-factor requirement at the actual transaction/on-chain execution boundary.

#### P1 — Verification / release

- [ ] Fresh CI verification of the latest oracle, recursive and dependency changes when Actions runtime is available.
- [ ] Complete backend/API route → controller → service → test reconciliation.
- [ ] Verify frontend wallet/transaction pending, rejected, failed and stale states.
- [ ] Verify deployed commit/artifact provenance, health checks, environments, migrations and contract addresses.
- [ ] Verify rollback/recovery procedure.

#### P2 — Governance / historical evidence

- [ ] Protect `main` and require relevant CI/security checks before merge.
- [ ] Verify secret/dependency scanning and operational monitoring/incident controls.
- [ ] Finish evidence-level reconciliation of Phase 1–13 completion claims.
- [ ] Close each remaining gap only with implementation/configuration evidence plus automated or operational verification.

### Verification constraint

GitHub Actions runtime exhaustion is an infrastructure constraint. It does not convert implementation into verified completion. CI-dependent items remain open until the repository can execute the required checks again.

### Handover rule

Implemented work is marked complete only as an implementation milestone. Production PASS requires the evidence defined above. This sprint may continue without Actions for non-CI implementation work, while CI-dependent gates remain explicitly open.

### Next execution entry point

Generate the reproducible dependency audit and resolved workspace inventory first. Then remediate compatible dependency families, followed by approved oracle deployment/integration evidence, authoritative yield-offset requirements, and actual on-chain recursive execution safety. Run the complete verification matrix as soon as Actions runtime is available.
