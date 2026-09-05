# W3B3 Active Tasks — Phase 14 Production Assurance

**Status:** ACTIVE / GATED  
**Current branch:** `main`  
**Phase 14 hardening branch:** merged to `main`  
**Phase 15:** PLANNED / GATED

## Implementation milestones completed

- [x] Phase 14 oracle observation validation and Chainlink round/timestamp guards.
- [x] Credit-line asset/oracle address validation and runtime valuation checks.
- [x] Recursive simulation input validation and leverage bounds.
- [x] Autonomous harvester source/target asset allowlisting.
- [x] Autonomous harvester safe ERC20 router approvals and allowance cleanup.
- [x] Regression coverage for the above security boundaries.
- [x] Dependency-security baseline and explicit audit/remediation policy.
- [x] CI dependency installation switched from `npm install` to lockfile-reproducible `npm ci` with npm caching.
- [x] Next.js 15 build compatibility fix.
- [x] Security credential scrub and CI security-job tracking.
- [x] Phase 14 merge into `main`.

## P0 — Production blockers

### 1. Dependency security
- [x] Record and correct the tracked root lockfile state in the dependency-security baseline.
- [x] Make CI dependency installation reproducible from the committed lockfile with `npm ci`.
- [ ] Reproduce the current resolved dependency inventory in a networked npm-capable environment.
- [ ] Re-run `npm audit` and classify advisories by direct/transitive exposure and production reachability.
- [ ] Upgrade compatible dependency families where fixes exist.
- [ ] Where upstream fixes do not exist, document compensating controls and explicit risk acceptance rather than forcing breaking upgrades.
- [ ] Regenerate authoritative lockfiles after dependency changes.
- [ ] Re-run application, contract and security verification.

### 2. Production oracle
- [ ] Confirm authoritative production feeds and networks.
- [ ] Confirm decimals, freshness/heartbeat policy and deployment addresses.
- [ ] Verify deployment configuration and runtime integration.
- [ ] Capture production/testnet evidence.

### 3. Recursive execution safety
- [ ] Locate the authoritative state-changing recursive execution boundary.
- [ ] Enforce minimum health factor **1.12** at that boundary.
- [ ] Prove backend simulation cannot authorize a transaction that violates the on-chain invariant.
- [ ] Add boundary and adversarial regression tests.

### 4. Yield-offset credit
- [ ] Recover/approve authoritative accounting requirements.
- [ ] Define principal, yield, debt, collateral, liquidation, loss and rounding semantics.
- [ ] Implement only the approved model.
- [ ] Add adversarial financial-invariant tests.

## P1 — Release assurance

- [ ] Fresh CI matrix: lint/typecheck, backend, contracts, frontend, build and security.
- [ ] Reconcile route → controller → service → persistence → test paths.
- [ ] Verify wallet transaction pending/rejected/failed/stale states.
- [ ] Verify deployment provenance, environment, migrations, health checks and contract addresses.
- [ ] Rehearse rollback/recovery.

## P2 — Governance / operations

- [ ] Protect `main` with required reviews and relevant checks.
- [ ] Verify secret/dependency scanning and operational monitoring.
- [ ] Reconcile evidence for historical Phase 1–13 completion claims.

## Definition of Done

A task is not a production PASS merely because code exists or a unit test passes. Financial/security controls require the appropriate combination of implementation, automated tests, deployment/configuration evidence and operational evidence.

## Handover / next sprint

When the P0/P1 Phase 14 gates are closed, create the Phase 15 execution branch and activate Sprint 15.01. Do not begin Phase 16/17 feature expansion as a substitute for production assurance.
