# W3B3 Next Sprint — Handover

## Sprint 14.08 — Production Security & Financial Safety

**Phase:** 14 — Production Assurance
**Status:** HANDOVER — implementation work closed for this session; verification blockers carried forward
**Working branch:** `phase-14/production-assurance`
**Phase 15:** GATED

### Sprint closeout

The implementation portion of Sprint 14.08 has been rounded up. Completed items are recorded in `docs/ACTIVE_TASKS.md`. This document contains only the work that must resume at the next execution session.

### P0 — Resume first

- [ ] **Dependency security** — remediate the remaining high/critical production dependency findings by compatible dependency families and re-run the complete test/security matrix.
- [ ] **Credit oracle production verification** — establish approved production feed/network configuration, deploy with the hardened preflight, and capture integration evidence.
- [ ] **Yield-offset credit** — locate authoritative requirements, implement the specified semantics, and add adversarial financial-invariant tests.
- [ ] **Recursive execution safety** — establish and prove actual transaction/on-chain enforcement of the 1.12 health-factor requirement.

### P1 — Verification and release

- [ ] Run fresh CI when GitHub Actions runtime is available; inspect lint/typecheck, backend, frontend, contract and security results.
- [ ] Complete backend/API route-controller-service-test reconciliation.
- [ ] Complete frontend/wallet critical journey and failure-state verification.
- [ ] Verify deployment provenance, health, environment configuration, migrations, contract addresses and rollback/recovery.

### P2 — Governance and historical evidence

- [ ] Enforce `main` branch protection and required CI/security checks.
- [ ] Verify secret/dependency scanning, monitoring and incident controls.
- [ ] Finish evidence-level reconciliation of Phase 1–13 completion claims.

### Definition of Done

A carried-forward item is complete only when implementation exists **and** appropriate automated/operational evidence is available. CI-dependent work requires a successful applicable CI run. Production financial/security controls require adversarial evidence and deployment/runtime evidence where applicable.

### Handover constraint

Actions runtime exhaustion does not change the Definition of Done. Work that does not require Actions can continue in the next session; CI-dependent items remain explicitly open until Actions can execute.

### Phase gate

**Phase 14 remains ACTIVE/GATED. Phase 15 must not begin until every P0/P1 production blocker has evidence-backed closure or explicit documented risk acceptance.**
