# W3B3 Active Tasks — Sprint 14.08

## Phase 14 — Production Security & Financial Safety

**Status:** ACTIVE / GATED  
**Working branch:** `phase-14/production-assurance`  
**Phase 15:** GATED

### P0 — Production blockers

- [ ] **Dependency security remediation** — resolve/mitigate outstanding high/critical production findings by compatible dependency families; no blind `npm audit fix --force`.
- [ ] **Production credit oracle** — mock price storage has been removed from `W3B3CreditLine`; explicit oracle interface and Chainlink adapter now exist. Remaining: approved feed configuration, deployment wiring, CI verification, and adversarial integration evidence.
- [ ] **Yield-offset credit** — establish the intended model from authoritative project requirements, then implement and prove it with contract/service financial-invariant tests.
- [ ] **Recursive execution safety** — prove the 1.12 health-factor requirement at the actual transaction/on-chain execution boundary.

### P1 — Verification / release

- [ ] Pass recursive regression suite in the repository's real backend Jest path; the previous CI run exposed a mock-isolation defect, now corrected on the branch.
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
- [x] Updated Sprint 14.08 execution order and evidence-based closure rules.

## Latest verification evidence

- CI run #210: lint/typecheck, contract tests and frontend tests passed; backend failed only in the newly added recursive controller suite because the test's module mock was not preserved under the repository's Jest reset configuration; security correctly failed on the existing production vulnerability backlog.
- The recursive test mock-isolation defect is corrected in commit `2e1b52ea4bcc0cfa1975d1e5ba8ed7a578a85680`.
- Chainlink round/timestamp hardening and adversarial tests are on subsequent branch commits and require a fresh CI run before closure.

## Immediate next actions

1. Verify the corrected recursive suite in CI and inspect the fresh full matrix.
2. Complete approved production Chainlink feed configuration/deployment path once network/feed requirements are established in-repo.
3. Implement the specified yield-offset credit model only after authoritative requirements are located; do not invent financial semantics.
4. Continue recursive on-chain enforcement and dependency-family remediation concurrently.

## Definition of Done

A task is complete only when implementation exists, the appropriate automated/operational verification passes, CI is green where applicable, and remaining release risk is accurately reflected in the repository. Implementation-only changes remain open.
