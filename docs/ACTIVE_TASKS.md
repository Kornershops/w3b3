# W3B3 Active Tasks — Sprint 14.08

## Phase 14 — Production Security & Financial Safety

**Status:** ACTIVE / GATED  
**Working branch:** `phase-14/production-assurance`  
**Phase 15:** GATED

### P0 — Production blockers

- [ ] **Dependency security remediation** — resolve/mitigate outstanding high/critical production findings by compatible dependency families; no blind `npm audit fix --force`.
- [ ] **Production credit oracle** — explicit oracle interface, Chainlink adapter, stale/future/incomplete-round checks, and contract-code checks are implemented. Remaining: approved feed configuration, deployment wiring, CI verification, and adversarial integration evidence.
- [ ] **Yield-offset credit** — establish the intended model from authoritative project requirements, then implement and prove it with contract/service financial-invariant tests.
- [ ] **Recursive execution safety** — prove the 1.12 health-factor requirement at the actual transaction/on-chain execution boundary.

### P1 — Verification / release

- [ ] Pass recursive regression suite in the repository's real backend Jest path.
- [ ] Pass full CI after the current contract/oracle wave and after each security/dependency change.
- [ ] Complete backend/API route → controller → service → test reconciliation.
- [ ] Verify frontend wallet/transaction pending, rejected, failed and stale states.
- [ ] Verify deployed commit/artifact provenance, health checks, environments, migrations and contract addresses.
- [ ] Verify rollback/recovery procedure.

### P2 — Governance / historical evidence

- [ ] Protect `main` and require relevant CI/security checks before merge.
- [ ] Verify secret/dependency scanning and operational monitoring/incident controls.
- [ ] Finish evidence-level reconciliation of Phase 1–13 completion claims.
- [ ] Close each gap only with implementation/configuration evidence plus automated or operational verification.

## Completed / advanced this sprint

- [x] Established Phase 14 production-assurance execution branch.
- [x] Converted production dependency audit into a hard CI gate.
- [x] Added recursive authentication/input validation.
- [x] Added recursive strategy maximum-leverage enforcement.
- [x] Added recursive controller regression coverage through the backend's discovered test path.
- [x] Replaced credit-line mock price storage with an explicit `IPriceOracle` dependency.
- [x] Added Chainlink price adapter with 18-decimal normalization and stale/invalid/incomplete-round rejection.
- [x] Hardened Chainlink validation against future timestamps and answered rounds older than the current round.
- [x] Migrated credit-line tests to the oracle architecture.
- [x] Added deterministic oracle/feed test fixtures and failure-case coverage.
- [x] Rejected externally owned addresses as credit-line oracle configuration.
- [x] Added regression coverage for invalid oracle addresses on construction and rotation.

## Verification evidence / policy

- CI action runtime exhaustion is an infrastructure constraint, not a reason to skip verification. Code and documentation can continue to be advanced, while CI-dependent tasks remain explicitly open until checks can run again.
- Previous CI runs established that the security job correctly blocks on the production dependency vulnerability backlog.
- Previous CI exposed and enabled correction of the recursive regression-test mock-isolation defect.
- Latest oracle hardening commits require fresh CI before closure.

## Immediate next actions

1. When Actions runtime is available, run and inspect the full contract/backend/frontend/security matrix.
2. Complete approved production Chainlink feed configuration/deployment path once network/feed requirements are established in-repo.
3. Implement the specified yield-offset credit model only after authoritative requirements are located; do not invent financial semantics.
4. Continue recursive on-chain enforcement and dependency-family remediation without waiting on Actions.
5. Complete backend/API, frontend/wallet, deployment/runtime and governance verification.

## Definition of Done

A task is complete only when implementation exists, the appropriate automated/operational verification passes, CI is green where applicable, and remaining release risk is accurately reflected in the repository. Implementation-only changes remain open.
