# W3B3 Platform — Release & Versioning Matrix

This document tracks the strategic journey of the W3B3 portal from its initial scaffold through the current production-assurance gate.

## Version History

v1.0.0 → March 15, 2026 → Initial Scaffold → Foundation layer with basic Prisma schema.
v1.1.0 → March 22, 2026 → Core Build → Integration of RainbowKit v2 and basic staking mechanics.
v1.2.0 → March 28, 2026 → Security Overhaul → Dual-JWT secrets and StakingPoolFactory deployment.
v1.4.0 → April 13, 2026 → Enterprise Ready → Yield-Backed Credit, Institutional Compliance, and AI Harvest.
v2.0.0 → April 14, 2026 → The Liquidity Protocol → Recursive Yield, Platinum Registry, and Keyless Analytics.
v3.0.0 → April 15, 2026 → Institutional Graduation → Multi-Sig Vaults, Governance Mandate, and Global Aggregation.

## Completed Phases — Historical Record

Phase 1–5 → Infrastructure → Wagmi v2, RainbowKit v2, ERC-4337 Account Abstraction, autonomous DB seeding. **Complete.**
Phase 6–10 → Intelligence & Experience → Predictive APY models, AI Harvesters, premium marketplace, sparklines. **Complete.**
Phase 11 → Institutional Inventory → 35-asset Platinum Registry, live CoinGecko sync. **Complete.**
Phase 12 → Security & Custody → Multi-Sig Vaults, weighted governance, proposal/approval rails. **Complete.**
Phase 13 → Global Analytics → Cross-vault aggregation, portfolio performance visualization, recursive yield engine. **Complete.**

> Phase 1–13 completion status is the preserved historical record. Phase 14 is the active production-assurance gate.

---

## Phase 14 — Production Assurance

**Status: Active / CI Failing. Not merged to main.**

Branch: `origin/phase-14/production-assurance` (~80 commits ahead of local `main`).

### Shipped on phase-14 (pending merge)

- Oracle observation validation at every price read (`W3B3CreditLine`, `W3B3RestakingHub`)
- Chainlink round completeness + timestamp staleness guards
- Credit line asset/oracle non-zero address rejection
- ERC20 `safeApprove` → `approve` hardening in `W3B3AutonomousHarvester`
- Rebalance asset allowlist enforcement
- Axios backend security upgrade
- Next.js bumped from `^14.2.0` to `^15.5.24` security line
- Recursive simulation input validation + leverage bounds enforcement

### Active CI Blockers

1. **`build` job** — `frontend/src/app/pool/[id]/page.tsx` uses Next 14 sync params signature `{ params: { id: string } }`. Next 15 requires `params: Promise<{id: string}>` with an async page component.
2. **`security` job** — `npm audit --audit-level=high` exits non-zero. 38 high/critical transitive vulns in `viem`, `@alchemy/aa-*`, `@coinbase/wallet-sdk`, `@safe-global`, `@tanstack/form`, `@babel/plugin-transform-modules-systemjs`. Job has `continue-on-error: true` but still marks the run failed.

### Passing on phase-14

- `lint-and-typecheck` ✓
- `test-backend` ✓
- `test-contracts` ✓
- `test-frontend` ✓

### Sprint 14 Carry-Forward (Next Sprint Gates)

- [ ] Fix `pool/[id]/page.tsx` for Next 15 async `PageProps`
- [ ] Resolve or scope-exclude the 38 audit vulns
- [ ] Merge phase-14 → main after CI green
- [ ] Governance vote persistence (`GovernanceVote` model + `castVote` DB write)
- [ ] Replace `Math.random()` mandate weights with real vote tally reads
- [ ] Re-enable `poolService.test.js.skipped` and `stakeService.test.js.skipped`
- [ ] Governance financial safety invariant verification

---

## Phase 15 — Runtime Completions & SDK Hardening

**Status: Planned. Not started.**

Targets the remaining stub/mock implementations that exist at the service and SDK layer.

- [ ] `RevenueRouterService.executeSwapToEth` — integrate 1inch v6 SDK for real fee harvesting
- [ ] `SafeService.proposeInstitutionalStake` — integrate `@safe-global/protocol-kit` for real Safe tx proposals
- [ ] `GasService.sponsorUserOperation` — end-to-end ERC-4337 paymaster test with real `ALCHEMY_GAS_POLICY_ID`
- [ ] `W3B3SDK.executeDeposit` / `deployCustomVault` — wire to real contracts and backend API (remove mock tx hashes)
- [ ] `portfolioService` institutional vault value — replace hardcoded `+15000` mock with real on-chain balance reads
- [ ] `predictiveAnalytics` historical data — persist real time-series to `PoolAnalytics` table instead of `Math.random()`
- [ ] `W3B3RestakingHub` withdrawal — implement real EigenLayer 7-day withdrawal queue
- [ ] `W3B3CreditLine` oracle — replace `collateralPriceAsset` mock price with live Chainlink feed (post phase-14 merge)
- [ ] Leaderboard referral link — replace `YOUR_CODE_HERE` placeholder with real per-user referral code

---

## Phase 16 — Mobile-First Ecosystem

**Status: Planned. Not started.**

- [ ] Glassmorphic mobile-responsive redesign across all 8 pages
- [ ] iOS/Android cross-chain staking wallet (React Native or PWA upgrade)
- [ ] Replace deprecated `next-pwa` v5 with a maintained PWA solution for Next 15 App Router

---

## Phase 17 — App-Chain Graduation

**Status: Vision. Not started.**

- [ ] `BridgeService` — replace `ALPHA_BRIDGE_STUB_READY` stub with real Hyperlane/CCIP integration
- [ ] Standalone W3B3 L3 App-Chain architecture
- [ ] Decentralized Insurance Fund / `$w3USD` global safety net expansion

---

Technical details documented in [API.md](./API.md) and [ARCHITECTURE.md](./ARCHITECTURE.md).
Detailed setup in [INSTALL.md](./INSTALL.md).
