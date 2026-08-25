# Phase 14 Sprint Map

## Sprint 14.01 — Historical Phase Reconciliation — CLOSED / PARTIAL
- [x] Confirm the repository's existing changelog marks Phases 1–13 complete.
- [ ] Complete evidence-level reconciliation of every Phase 1–13 claim.
- [ ] Publish final reconciliation report.

**Closeout:** Historical completion is preserved as the documented project record; evidence reconciliation remains a Phase 14 carry-over because the current repository does not yet provide complete proof for every historical claim.

## Sprint 14.02 — CI / Build / Security Gate — CLOSED / PARTIAL
- [x] Convert production dependency audit into a hard CI gate.
- [x] Preserve lint/typecheck/backend/contracts/frontend/build pipeline structure.
- [x] Document security remediation policy.
- [ ] Reduce high/critical production dependency findings to an acceptable release state.
- [ ] Complete clean-from-zero reproducibility verification on the final remediation set.

**Closeout:** The gate-design task is complete. The gate is now correctly blocking the branch when high/critical vulnerabilities are present. The vulnerability backlog carries forward to the next sprint.

## Sprint 14.03 — Contract / Financial Safety — CARRY-OVER
- [ ] Replace/productionize the mock owner-controlled credit oracle.
- [ ] Implement and test specified yield-offset behavior.
- [ ] Adversarially test LTV, liquidation, interest, oracle failure and access control.
- [ ] Prove recursive health-factor enforcement at the transaction/on-chain execution boundary.

## Sprint 14.04 — Backend / API / Data — CLOSED / PARTIAL
- [x] Add recursive request validation for authenticated user, strategy, amount and leverage.
- [x] Enforce strategy maximum leverage in the recursive simulation service.
- [x] Add regression coverage through the backend's actual Jest discovery path.
- [ ] Obtain passing CI evidence for the regression suite.
- [ ] Finish API-to-route/controller/service/test reconciliation and failure-mode review.

## Sprint 14.05 — Frontend / Wallet — CARRY-OVER
- [ ] Verify critical wallet and transaction journeys.
- [ ] Test pending/rejected/failed/stale states and authorization boundaries.
- [ ] Verify frontend/backend contract consistency.

## Sprint 14.06 — Deployment / Runtime — CARRY-OVER
- [x] Confirm deployment automation exists and has previously completed for backend, contracts and frontend.
- [ ] Verify deployed artifacts correspond to a known commit.
- [ ] Verify health checks, environment separation, migrations and contract addresses.
- [ ] Verify rollback/recovery path.

## Sprint 14.07 — Governance / Operations — CARRY-OVER
- [ ] Protect `main`.
- [ ] Require CI/security checks before merge.
- [ ] Verify secret/dependency scanning, backups/recovery, monitoring, incident and rollback procedures.

## Sprint Closeout

**Sprint result:** Phase 14 remains OPEN. Completed tasks have been marked above; unresolved work is explicitly carried into the next sprint instead of being reclassified as complete.

## Next Sprint — 14.08 Production Security & Financial Safety

Priority order:
1. Remediate production dependency vulnerabilities by compatible dependency families; re-run the full CI matrix after each family.
2. Close recursive validation with passing automated CI evidence, then prove execution-boundary/on-chain enforcement.
3. Design and implement the production credit oracle architecture and yield-offset behavior with adversarial tests.
4. Complete API/backend reconciliation and frontend wallet journey verification.
5. Establish deployed-commit/runtime evidence and rollback verification.
6. Enforce `main` protection and required CI/security checks.
7. Finish historical Phase 1–13 evidence reconciliation.

## Exit

Phase 14 cannot pass while a production blocker remains unresolved or lacks an explicit documented risk acceptance.
