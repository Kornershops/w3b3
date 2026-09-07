# Sprint 15.01 — Production Gate Closure

**Phase:** 15 — Production Readiness  
**Status:** ACTIVE / GATED  
**Base:** `main` after Phase 14 hardening  
**Sprint objective:** close the highest-risk P0/P1 production gates and produce auditable evidence.

## Sprint priorities

### Track A — Security / P0
- [ ] Restore networked npm execution.
- [ ] Run and classify `npm audit`.
- [ ] Apply compatible dependency remediation and regenerate lockfiles.
- [ ] Obtain authoritative oracle/network/feed inputs and deployment evidence.
- [ ] Identify the real state-changing recursive executor.
- [ ] Enforce the minimum health-factor invariant at that executor boundary.
- [ ] Add adversarial recursive execution tests.

### Track B — Financial correctness / P0–P1
- [ ] Obtain explicit approval for yield-offset accounting semantics.
- [ ] Record decisions for principal, yield, debt, collateral, losses, liquidation, timing, rounding and duplicate events.
- [ ] Implement only the approved authoritative model.
- [ ] Implement authoritative yield/pool data adapter.
- [ ] Define field-level provenance, freshness, decimals and failure behavior.
- [ ] Reconcile yield adapter output with approved accounting semantics.

### Track C — Release engineering / P1
- [ ] Add production configuration validation tests.
- [ ] Verify production secrets, RPC and treasury configuration.
- [ ] Trace all frontend transaction call sites.
- [ ] Integrate pending/rejected/failed/stale/confirmed lifecycle states into user-facing EOA flows.
- [ ] Keep AA disabled unless its production network/bundler configuration is authoritative.
- [ ] Run full CI verification when package/runtime capacity is available.
- [ ] Verify migrations, addresses, `/health`, `/readyz`, deployment provenance and rollback/recovery.

## Definition of done

A sprint item is complete only when its evidence matches the item type:

- **Implementation:** code is present and reviewed.
- **Tested:** relevant automated test actually executed.
- **Verified:** runtime/deployment behavior actually observed.
- **Production-approved:** authoritative operational/business evidence exists and the release gate is explicitly approved.

If execution is blocked by missing network, secrets, CI capacity or authoritative external inputs, mark the item blocked/not runtime-verified rather than claiming success.

## Commit / handover policy

- Keep independent work in separate substantive commits.
- Push completed, verified documentation updates to `main`.
- Update `docs/ACTIVE_TASKS.md` whenever sprint status materially changes.
- Do not use a new feature phase to bypass an unresolved P0/P1 production gate.

## Handoff checklist

- [ ] P0 gates have explicit owners/evidence or remain clearly blocked.
- [ ] P1 release gates have explicit verification state.
- [ ] No mock/random financial values remain on authoritative paths.
- [ ] No speculative production addresses/configuration have been introduced.
- [ ] Release evidence pack is assembled.
- [ ] Go/no-go decision is recorded.
