# W3B3 Active Tasks — Next Sprint

## Sprint 14.08 — Production Security & Financial Safety

**Status:** ACTIVE
**Branch:** `phase-14/production-assurance`
**Phase:** 14 — Production Assurance
**Rule:** Do not advance to Phase 15 until the Phase 14 exit criteria are satisfied.

### P0 — Production blockers

- [ ] **Dependency security remediation** — resolve/mitigate the outstanding high/critical production dependency findings by compatible dependency families; do not use blind `npm audit fix --force`.
- [ ] **Credit oracle productionization** — replace mock/owner-controlled pricing with the intended production oracle architecture and add failure/staleness/access-control tests.
- [ ] **Yield-offset credit** — implement the specified yield-offset acceptance behavior and prove it with contract/service tests.
- [ ] **Recursive execution safety** — prove the 1.12 health-factor requirement is enforced at the actual transaction/on-chain execution boundary, not only in backend simulation.

### P1 — Verification and release gates

- [ ] Run and pass the recursive regression suite through the repository's actual backend Jest path.
- [ ] Re-run full CI after every dependency/security change: lint/typecheck, backend, contracts, frontend, build and security audit.
- [ ] Complete backend/API route → controller → service → test reconciliation.
- [ ] Verify frontend wallet/transaction journeys, including pending, rejected, failed and stale states.
- [ ] Verify deployed commit/artifact provenance, health checks, environment separation, migrations and contract addresses.
- [ ] Verify rollback/recovery procedure.

### P2 — Governance and historical reconciliation

- [ ] Protect `main` and require the relevant CI/security status checks before merge.
- [ ] Verify secret/dependency scanning and operational monitoring/incident controls.
- [ ] Complete evidence-level reconciliation for every Phase 1–13 completion claim.
- [ ] Update the gap register as each task closes; closure requires implementation/configuration evidence plus automated or operational verification.

## Completed in previous sprint

- [x] Established Phase 14 production-assurance branch and execution docs.
- [x] Converted production dependency audit from non-gating to a hard CI gate.
- [x] Added recursive request validation for authentication, strategy, amount and leverage.
- [x] Added recursive strategy maximum-leverage enforcement.
- [x] Added recursive controller regression coverage in the backend's discovered JavaScript test path.
- [x] Documented security remediation policy and Phase 14 gap/exit rules.

## Carry-over blockers

- Production dependency vulnerability backlog remains unresolved.
- Credit oracle and yield-offset behavior remain unresolved.
- Recursive on-chain enforcement remains unproven.
- Runtime/deployment provenance and governance remain unverified.

## Definition of Done

A task is not complete because code exists. It must have the appropriate automated test or operational evidence, pass CI where applicable, be reflected in the gap register, and have no unresolved release-critical regression.
