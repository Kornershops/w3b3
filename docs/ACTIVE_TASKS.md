# W3B3 Active Tasks — Phase 14 Production Assurance

**Status:** ACTIVE / GATED  
**Current branch:** `main`  
**Phase 14 hardening branch:** merged to `main`  
**Phase 15:** PLANNED / GATED

## Implementation milestones completed

- [x] Phase 14 oracle observation validation and Chainlink round/timestamp guards.
- [x] Oracle deployment preflight requires explicit chain/feed/decimal/freshness configuration and a non-zero deployment key.
- [x] Credit-line asset/oracle address validation and runtime valuation checks.
- [x] Explicit credit-line minimum health-factor constant/guard at borrow and collateral-withdrawal mutation boundaries.
- [x] Recursive simulation input validation and leverage bounds.
- [x] Autonomous harvester source/target asset allowlisting.
- [x] Autonomous harvester safe ERC20 router approvals and allowance cleanup.
- [x] Regression coverage for the above security boundaries.
- [x] Dependency-security baseline and explicit audit/remediation policy.
- [x] CI dependency installation switched from `npm install` to lockfile-reproducible `npm ci` with npm caching.
- [x] Next.js 15 build compatibility fix.
- [x] Security credential scrub and CI security-job tracking.
- [x] Phase 14 merge into `main`.
- [x] P0-4 gap analysis: current yield-offset semantics are explicitly unapproved and no production accounting implementation is authorized.
- [x] P0-4 reviewable accounting proposal added at `docs/YIELD_OFFSET_ACCOUNTING_PROPOSAL.md`.
- [x] P1 yield analytics no longer fabricates APY/TVL, harvest amounts or estimated harvest timing when authoritative evidence is unavailable.
- [x] P1 production configuration hardening: insecure production auth-secret fallbacks are rejected and treasury reads require an explicit authoritative RPC/address.
- [x] Backend environment example documents `WEB3_RPC_URL`, `TREASURY_ADDRESS` and production secret requirements.

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
- [x] Credit-line deployment preflight validates target chain ID, oracle feed address, feed decimals, oracle `maxAge`, live feed code and observation freshness.
- [x] Credit-line deployment preflight rejects absent/zero deployment credentials instead of silently using the Hardhat zero-key fallback.
- [x] `.env.example` documents the explicit oracle evidence inputs required by deployment.
- [x] Canonical evidence checklist maintained at `docs/ORACLE_PRODUCTION_EVIDENCE.md`.
- [ ] **DEPENDENCY:** Authoritative network/feed selection is required before production addresses can be approved.
- [ ] **DEPENDENCY:** Authoritative feed decimals, heartbeat/freshness limits and deployment addresses are required.
- [ ] **DEPENDENCY:** Testnet/production deployment evidence and runtime environment values are required.
- [ ] Confirm authoritative production feeds and networks.
- [ ] Confirm decimals, freshness/heartbeat policy and deployment addresses.
- [ ] Verify deployment configuration and runtime integration on the selected network.
- [ ] Capture signed/traceable production and testnet deployment evidence.
- [ ] **VERIFICATION:** Full networked deployment test remains pending until the required network/secrets/evidence are available.

### 3. Recursive execution safety — 🔴 OPEN / ARCHITECTURE DEPENDENCY
- [x] Confirm backend recursive simulation is advisory rather than an authorization boundary.
- [x] Confirm no `W3B3RecursiveVault` execution surface exists at the expected contract path.
- [x] Add an explicit **1.12 minimum health-factor guard** to the existing credit-line borrow/withdrawal mutation boundaries as defense in depth.
- [x] Add regression coverage for the declared health-factor floor and existing LTV boundaries.
- [ ] **DEPENDENCY:** The authoritative state-changing recursive executor/transaction path must be identified before an on-chain recursive-loop guard can be safely implemented.
- [ ] Locate the authoritative state-changing recursive execution boundary.
- [ ] Wire the same minimum health-factor invariant into the recursive executor itself once that boundary is identified.
- [ ] Prove backend simulation cannot authorize a transaction that violates the on-chain invariant.
- [ ] Add executor-boundary and adversarial recursive-loop regression tests.
- [ ] **VERIFICATION:** Local/CI contract test execution remains pending where the current environment cannot provide the required package/runtime execution; no passing result is claimed.

### 4. Yield-offset credit — 🔴 OPEN / SPECIFICATION DEPENDENCY
**Implementation:** NOT AUTHORIZED until the financial/accounting model is approved.  
**Review artifact:** `docs/YIELD_OFFSET_ACCOUNTING_PROPOSAL.md`

- [x] Gap analysis confirms `CreditPosition` stores collateral/borrowed amounts but has no authoritative yield-offset ledger.
- [x] Gap analysis confirms backend `CreditService` still contains non-authoritative/mock health-factor behavior and cannot be the economic source of truth.
- [x] Create a conservative, reviewable accounting proposal without treating it as an approved requirement.
- [ ] **DEPENDENCY:** Product/financial authority must approve the accounting model.
- [ ] **DEPENDENCY:** Authority must define principal, gross/net yield, debt, collateral, liquidation, losses, timing and rounding.
- [ ] Record explicit approval/rejection decisions for all proposal questions.
- [ ] Implement only the approved model at the authoritative state-changing boundary.
- [ ] Add adversarial financial-invariant tests covering yield/debt/collateral/liquidation/rounding and duplicate events.
- [ ] **VERIFICATION:** No AC4 production PASS is claimed until approved semantics, implementation, automated tests and required deployment/operational evidence exist.

## P1 — Release assurance

### 1. Authoritative yield/analytics data — 🔴 OPEN / ADAPTER DEPENDENCY
- [x] Remove synthetic/random APY, TVL and price generation from the yield synchronization path.
- [x] Remove hardcoded harvest amount and fabricated harvest schedule from yield statistics.
- [x] Only persist CoinGecko market history when an identifier and successful response exist.
- [ ] **DEPENDENCY:** Implement and verify an authoritative staking/pool adapter that reads APY/TVL from the actual protocol/pool contracts or another explicitly approved source.
- [ ] Define provenance, freshness, decimals and failure semantics for each yield field.
- [ ] Add adapter-level tests for stale, malformed, unavailable and boundary responses.
- [ ] Reconcile the adapter output with the accounting/credit model before using yield as financial input.

### 2. Production configuration and treasury integrity — 🟠 HARDENED / VERIFICATION OPEN
- [x] Remove insecure production fallbacks for `ADMIN_SECRET`, `JWT_SECRET` and `JWT_REFRESH_SECRET`.
- [x] Add explicit `WEB3_RPC_URL` configuration and require a non-local authoritative RPC for treasury reads.
- [x] Reject missing, zero or invalid `TREASURY_ADDRESS` instead of returning financial placeholders.
- [x] Document the new production inputs in `backend/.env.example`.
- [ ] Verify all production deployment environments provide the required secrets/RPC/treasury values.
- [ ] Add automated configuration tests for missing/zero/invalid production values.
- [ ] Confirm the selected RPC and treasury address against deployment provenance/evidence.
- [ ] **VERIFICATION:** Runtime/networked verification remains pending.

### 3. Release verification
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
