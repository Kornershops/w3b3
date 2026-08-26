# W3B3 Active Tasks — Sprint 14.08

## Phase 14 — Production Security & Financial Safety

**Status:** ACTIVE / GATED  
**Working branch:** `phase-14/production-assurance`  
**Phase 15:** GATED

### P0 — Production blockers

- [ ] **Dependency security remediation** — resolve/mitigate outstanding high/critical production findings by compatible dependency families; no blind `npm audit fix --force`.
- [ ] **Production credit oracle** — current mock price state has been removed from `W3B3CreditLine`; explicit oracle interface and Chainlink adapter now exist. Remaining: approved feed configuration, deployment wiring, CI verification, and adversarial integration evidence.
- [ ] **Yield-offset credit** — implement specified yield-offset behavior and prove it with contract/service tests.
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
- [x] Migrated credit-line tests to the oracle architecture.
- [x] Added deterministic oracle/feed test fixtures and failure-case coverage.
- [x] Updated Sprint 14.08 execution order and evidence-based closure rules.

## Immediate next actions

1. Run/inspect CI on the current branch head and fix all compile/test failures before further contract work.
2. Add the approved production Chainlink feed configuration/deployment path once network/feed requirements are established in-repo.
3. Implement the specified yield-offset credit model and adversarial financial-invariant tests.
4. Continue recursive on-chain enforcement and dependency-family remediation concurrently.

## Definition of Done

A task is complete only when implementation exists, the appropriate automated/operational verification passes, CI is green where applicable, and remaining release risk is accurately reflected in the repository. Implementation-only changes remain open.
