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

### 1. Dependency security — 🔴 OPEN / ENVIRONMENT-BLOCKED
- [x] Record and correct the tracked root lockfile state in the dependency-security baseline.
- [x] Make CI dependency installation reproducible from the committed lockfile with `npm ci`.
- [ ] **DEPENDENCY:** Networked npm execution is required to reproduce the resolved dependency inventory.
- [ ] Re-run `npm audit` and classify advisories by direct/transitive exposure and production reachability.
- [ ] Upgrade compatible dependency families where fixes exist.
- [ ] Where upstream fixes do not exist, document compensating controls and explicit risk acceptance rather than forcing breaking upgrades.
- [ ] Regenerate authoritative lockfiles after dependency changes.
- [ ] Re-run application, contract and security verification.

### 2. Production oracle — 🟠 OPEN / EXTERNAL EVIDENCE REQUIRED
**Implementation hardening:** COMPLETE  
**Production approval:** BLOCKED pending authoritative deployment evidence.

- [x] Oracle adapter rejects invalid/future/stale observations and incomplete rounds.
- [x] Oracle adapter normalizes feed values to 18 decimals.
- [x] Credit-line constructor/setter validates oracle contract presence and live observation.
- [x] Credit-line deployment preflight validates target chain ID, oracle feed address, oracle `maxAge`, live feed code and observation freshness.
- [x] `.env.example` documents the explicit oracle evidence inputs required by deployment.
- [x] Canonical evidence checklist created at `docs/ORACLE_PRODUCTION_EVIDENCE.md`.
- [ ] **DEPENDENCY:** Authoritative network/feed selection is required before production addresses can be approved.
- [ ] **DEPENDENCY:** Authoritative feed decimals, heartbeat/freshness limits and deployment addresses are required.
- [ ] **DEPENDENCY:** Testnet/production deployment evidence and runtime environment values are required.
- [ ] Confirm authoritative production feeds and networks.
- [ ] Confirm decimals, freshness/heartbeat policy and deployment addresses.
- [ ] Verify deployment configuration and runtime integration on the selected network.
- [ ] Capture signed/traceable production and testnet deployment evidence.

### 3. Recursive execution safety — 🔴 NEXT CODE TASK / ARCHITECTURE GAP
- [x] Confirm backend recursive simulation is advisory rather than an authorization boundary.
- [x] Confirm no `W3B3RecursiveVault` execution surface exists at the expected contract path.
- [ ] **DEPENDENCY:** The authoritative state-changing recursive executor/transaction path must be identified before an on-chain HF guard can be safely implemented.
- [ ] Locate the authoritative state-changing recursive execution boundary.
- [ ] Enforce minimum health factor **1.12** at that boundary.
- [ ] Prove backend simulation cannot authorize a transaction that violates the on-chain invariant.
- [ ] Add boundary and adversarial regression tests.

### 4. Yield-offset credit — 🔴 OPEN / SPECIFICATION DEPENDENCY
- [ ] **DEPENDENCY:** Product/financial authority approval of the yield-offset accounting model is required before implementation.
- [ ] **DEPENDENCY:** Authoritative definitions are required for principal, gross/net yield, debt, collateral, liquidation, losses, timing and rounding.
- [ ] Recover/approve authoritative accounting requirements.
- [ ] Define principal, yield, debt, collateral, liquidation, loss and rounding semantics.
- [ ] Implement only the approved model.
- [ ] Add adversarial financial-invariant tests.

## P1 — Release assurance

- [ ] Fresh CI matrix: lint/typecheck, backend, contracts, frontend, build and security.
- [ ] **DEPENDENCY:** GitHub Actions capacity/networked package installation is required for release CI certification.
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
