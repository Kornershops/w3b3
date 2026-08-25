# W3B3 Active Tasks — Next Sprint

## Sprint 14.08 — Production Security & Financial Safety

**Status:** READY FOR EXECUTION
**Phase:** 14 — Production Assurance
**Working branch:** `phase-14/production-assurance`
**Phase 15:** GATED

### P0 — Production blockers

- [ ] Dependency security remediation — resolve/mitigate outstanding high/critical production findings by compatible dependency families; no blind `npm audit fix --force`.
- [ ] Production credit oracle — replace mock/owner-controlled pricing with the intended production oracle architecture and test staleness/failure/access control.
- [ ] Yield-offset credit — implement specified yield-offset behavior and prove it with contract/service tests.
- [ ] Recursive execution safety — prove the 1.12 health-factor requirement at the actual transaction/on-chain execution boundary.

### P1 — Verification / release

- [ ] Pass recursive regression suite in the repository's real backend Jest path.
- [ ] Pass full CI after each security/dependency change.
- [ ] Complete backend/API route → controller → service → test reconciliation.
- [ ] Verify frontend wallet/transaction pending, rejected, failed and stale states.
- [ ] Verify deployed commit/artifact provenance, health checks, environments, migrations and contract addresses.
- [ ] Verify rollback/recovery procedure.

### P2 — Governance / historical evidence

- [ ] Protect `main` and require relevant CI/security checks before merge.
- [ ] Verify secret/dependency scanning and operational monitoring/incident controls.
- [ ] Finish evidence-level reconciliation of Phase 1–13 completion claims.
- [ ] Close each gap only with implementation/configuration evidence plus automated or operational verification.

## Completed this sprint

- [x] Established Phase 14 production-assurance execution branch.
- [x] Converted production dependency audit into a hard CI gate.
- [x] Added recursive authentication/input validation.
- [x] Added recursive strategy maximum-leverage enforcement.
- [x] Added recursive controller regression coverage through the backend's discovered test path.
- [x] Documented the sprint handoff and release-gate rules.

## Sprint handoff

The current sprint is closed. Do not add new implementation tasks here during the sprint freeze; use this file as the execution checklist for Sprint 14.08 and update checkboxes only as evidence-backed work closes.

## Definition of Done

A task is complete only when implementation exists, the appropriate automated/operational verification passes, CI is green where applicable, and the remaining release-risk is reflected accurately in the repository.
