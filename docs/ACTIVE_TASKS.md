# W3B3 Active Tasks — Phase 15 Production Readiness Handover

**Status:** ACTIVE / GATED  
**Current branch:** `main`  
**Phase 14:** HARDENING COMPLETE / MERGED  
**Phase 15:** ACTIVE / GATED — production readiness  
**Next sprint:** Sprint 15.01 — close P0/P1 production gates

## Handover rule

Phase 15 is a production-assurance phase, not a feature-expansion phase. Do not advance to new product features until the P0/P1 gates below have authoritative implementation, automated-test, deployment/configuration and operational evidence as applicable.

## Completed baseline handed into Phase 15

- [x] Phase 14 oracle observation validation and Chainlink round/timestamp guards.
- [x] Oracle deployment preflight requires explicit chain/feed/decimal/freshness configuration and a non-zero deployment key.
- [x] Credit-line asset/oracle address validation and runtime valuation checks.
- [x] Explicit credit-line minimum health-factor guard at borrow and collateral-withdrawal mutation boundaries.
- [x] Recursive simulation input validation and leverage bounds.
- [x] Autonomous harvester source/target asset allowlisting and safe ERC20 approval lifecycle.
- [x] Regression coverage for completed security boundaries.
- [x] Dependency-security baseline and reproducible `npm ci` installation policy.
- [x] P0-4 yield-offset gap analysis and reviewable accounting proposal; production accounting remains unauthorized.
- [x] Yield analytics no longer fabricates APY/TVL, harvest amounts or estimated harvest timing without authoritative evidence.
- [x] Production auth-secret, RPC and treasury configuration hardening.
- [x] Backend `/health` liveness and `/readyz` dependency readiness probes.
- [x] Frontend transaction status model: `pending`, `confirmed`, `failed`, `rejected`, `stale`.
- [x] Deterministic frontend transaction lifecycle primitives and regression tests.
- [x] Current Sepolia-bound AA path explicitly gated behind `NEXT_PUBLIC_AA_ENABLED=true`; EOA remains the default.

## P0 — Production blockers

### P0.1 Dependency security — 🔴 OPEN / ENVIRONMENT-BLOCKED
- [x] Correct tracked root lockfile baseline.
- [x] CI uses lockfile-reproducible `npm ci`.
- [ ] Restore networked npm execution and reproduce the resolved dependency inventory.
- [ ] Run fresh `npm audit`; classify direct/transitive exposure and production reachability.
- [ ] Apply compatible security upgrades without blind force upgrades.
- [ ] Document compensating controls/risk acceptance where no safe upstream fix exists.
- [ ] Regenerate authoritative lockfiles and rerun verification.

**Exit evidence:** audit output + remediation record + committed lockfile + application/contract/security verification.

### P0.2 Production oracle — 🟠 OPEN / EXTERNAL EVIDENCE REQUIRED
- [x] Observation validity/freshness/round guards.
- [x] 18-decimal normalization.
- [x] Deployment preflight for chain/feed/decimals/maxAge/code/freshness/credentials.
- [x] Production evidence checklist.
- [ ] Approve authoritative production network and oracle feed.
- [ ] Approve authoritative feed decimals, heartbeat/freshness policy and deployment addresses.
- [ ] Deploy/verify on selected network and capture traceable evidence.
- [ ] Verify runtime environment against the same provenance.

**Exit evidence:** authoritative network/feed record + deployment transaction/address evidence + runtime verification.

### P0.3 Recursive execution safety — 🔴 OPEN / ARCHITECTURE DEPENDENCY
- [x] Confirm simulation is advisory, not authorization.
- [x] Confirm expected `W3B3RecursiveVault` execution surface is absent at the inspected path.
- [x] Add 1.12 minimum health-factor defense-in-depth guard to credit-line borrow/withdrawal boundaries.
- [x] Add guard/LTV regression coverage.
- [ ] Identify the authoritative state-changing recursive executor.
- [ ] Apply the same invariant at the executor boundary.
- [ ] Prove simulation cannot authorize an unsafe transaction.
- [ ] Add executor-boundary and adversarial loop tests.

**Exit evidence:** identified executor + on-chain invariant + adversarial tests + verified transaction path.

### P0.4 Yield-offset credit — 🔴 OPEN / SPECIFICATION DEPENDENCY
- [x] Gap analysis completed.
- [x] Conservative accounting proposal at `docs/YIELD_OFFSET_ACCOUNTING_PROPOSAL.md`.
- [ ] Product/financial authority approves or rejects proposal decisions.
- [ ] Define principal, gross/net yield, debt, collateral, liquidation, losses, timing, rounding and duplicate-event semantics.
- [ ] Implement only the approved model at the authoritative state-changing boundary.
- [ ] Add adversarial financial-invariant tests.

**Exit evidence:** signed/traceable model approval + authoritative implementation + tests + deployment/accounting evidence.

## P1 — Release assurance

### P1.1 Authoritative yield/analytics — 🔴 OPEN / ADAPTER DEPENDENCY
- [x] Remove synthetic/random APY, TVL and price generation.
- [x] Remove fabricated harvest amount/schedule.
- [x] Persist market history only on valid identifier + successful response.
- [ ] Implement authoritative staking/pool adapter from approved protocol contracts/source.
- [ ] Define provenance, freshness, decimals and failure semantics for every financial field.
- [ ] Add stale/malformed/unavailable/boundary adapter tests.
- [ ] Reconcile adapter output with approved accounting/credit semantics.

### P1.2 Production configuration/treasury — 🟠 HARDENED / VERIFICATION OPEN
- [x] Remove production auth-secret fallbacks.
- [x] Require explicit authoritative `WEB3_RPC_URL`.
- [x] Reject missing/zero/invalid `TREASURY_ADDRESS`.
- [x] Reject development fallbacks when `NODE_ENV=production`.
- [x] Add `/readyz` DB + Web3 readiness gate.
- [ ] Verify every deployment environment has required secrets/RPC/treasury values.
- [ ] Add automated configuration tests for missing/zero/invalid production values.
- [ ] Reconcile RPC/treasury against deployment provenance.
- [ ] Complete runtime/networked verification.

### P1.3 Transaction lifecycle — 🟠 PRIMITIVES COMPLETE / INTEGRATION OPEN
- [x] Status model distinguishes pending/confirmed/failed/rejected/stale.
- [x] Deterministic lifecycle classification and timeout primitives.
- [x] Regression tests for lifecycle primitives.
- [x] AA activation is explicit opt-in.
- [ ] Identify and migrate all user-facing EOA transaction call sites.
- [ ] Integrate lifecycle state into user-facing transaction flows without breaking existing consumers.
- [ ] Persist/expose transaction lifecycle state where backend history requires it.
- [ ] Replace Sepolia-bound AA configuration with authoritative production network/bundler configuration before enabling AA in production.
- [ ] Verify pending/rejected/failed/stale/confirmed states end-to-end.

### P1.4 Release verification — 🔴 OPEN
- [ ] Fresh CI matrix: lint/typecheck, backend, contracts, frontend, build and security.
- [ ] **DEPENDENCY:** GitHub Actions capacity/networked package installation is required for release CI certification.
- [ ] Reconcile route → controller → service → persistence → test paths.
- [ ] Verify deployment provenance, environment, migrations, health checks and contract addresses.
- [ ] Rehearse rollback/recovery.
- [ ] Produce release evidence pack and explicit go/no-go decision.

## P2 — Governance / operations

- [ ] Protect `main` with required reviews and relevant checks.
- [ ] Verify secret/dependency scanning and operational monitoring.
- [ ] Reconcile evidence for historical Phase 1–13 completion claims.

## Definition of Done

A task is not a production PASS merely because code exists or a unit test passes. Financial/security controls require the appropriate combination of implementation, automated tests, deployment/configuration evidence and operational evidence.

## Next sprint activation

**Sprint 15.01 starts with P0/P1 gate closure in dependency order.** Work concurrently only where tasks are independent. Do not implement speculative financial semantics, recursive execution boundaries or production AA configuration without the required authority/evidence.

### Sprint 15.01 priority order

1. Dependency/security inventory and remediation.
2. Authoritative oracle/network evidence.
3. Recursive executor discovery and invariant enforcement.
4. Financial-model approval for yield-offset credit.
5. Authoritative yield adapter + provenance contract.
6. Production configuration tests and environment verification.
7. Transaction lifecycle call-site integration.
8. Full release CI and deployment/rollback evidence.
