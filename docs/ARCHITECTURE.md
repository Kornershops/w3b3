# W3B3 Strategic Architecture

Structural overview of the W3B3 multi-chain portal.

## Vision-Led Infrastructure

Every architectural decision in W3B3 is designed to support the mission of zero-friction institutional staking.

Interactive UI → Premium Experience → Next.js 15 SPA with real-time reward interpolation.
Wallet Context → Multi-Chain Unified → RainbowKit v2 + Wagmi v2 with chain-sync detection.
Backend API → Resilient Scaling → JWT secret rotation + Redis-backed pool discovery.
Storage Layer → Data Integrity → Relational Postgres schema managed via Prisma ORM.
Smart Contracts → Protocol Security → Audit-standard Solidity 0.8.24 with Pausable logic and Chainlink oracle guards.

> Note: Next.js 15 is live on `origin/phase-14/production-assurance`. Local `main` is still on Next.js 14 pending phase-14 merge.

## Infrastructure Matrix

→ Deployment Hosting → Netlify (Front) / Render (Back) → High-availability CI/CD.
→ Blockchain Access → Alchemy → Unified multi-chain RPC node layer.
→ Database Persistence → Render PostgreSQL (`sslmode=require`) → Structured data for users/stakes.
→ Cache & Real-Time → Redis & Socket.io → Performance and live updates.

## Project Organization

/frontend → Web Interface → App Router (8 pages), Components, Hooks, and Stores.
/backend → Core API → Routes, Services (20+), Middleware, and Database Schema.
/contracts → DeFi Logic → 14 Solidity contracts with full TypeChain types and Hardhat test suite.
/shared → SDK & Models → W3B3SDK white-label class and shared TypeScript models.
/docs → Knowledge Base → Deployment, API, roadmap, and setup guides.

## Frontend Pages

/ → Landing → Hero, feature trays, CTA.
/explore → Pool Discovery → 35-asset registry with stake modal.
/portfolio → Institutional Portfolio → Net worth aggregation, live reward ticker, treasury dashboard.
/governance → Protocol Mandate → Yield gauge voting, voting power, multiplier tiers.
/recursive → Recursive Yield → Leveraged LST looping strategies and health factor simulation.
/institutional → Custody Suite → Multi-sig vault creation, proposal/approval rails.
/factory → Vault Factory → Permissionless vault deployment UI.
/leaderboard → Referral Rankings → Global point leaderboard.

## Critical Design Principles

→ Frictionless Wallet UX → Automatic network switching and high-speed account abstraction logins.
→ Institutional Trust → Native Multi-Sig Vaults with weighted governance and approval rails.
→ Keyless Analytics Suite → Pro-grade charting and resilient, throttled CoinGecko integration (zero API keys).
→ Capital Efficiency → Recursive yield looping and real-time health factor simulation (min 1.12 guardrail).
→ Protocol Mandate → Community-driven yield weights and tiered loyalty multipliers (1.0x–1.5x).

## Backend Service Layer

- **AuthService** → SIWE signature verification, dual-JWT rotation.
- **StakeService** → Create, unstake, and reward claim lifecycle.
- **PoolService** → Pool discovery, filtering, and analytics.
- **PortfolioService** → Global net worth aggregation (personal + institutional vaults).
- **InstitutionalVaultService** → Multi-sig vault CRUD, proposal, and approval logic.
- **InstitutionalCustodyService** → Authorized signer verification, double-approval prevention, atomic DB transactions.
- **RecursiveYieldService** → Net APY calculation, loop simulation, health factor projection.
- **GovernanceService** → Voting power calculation, yield multiplier tiers, vote casting.
- **AIHarvestService** → Algorithmic rebalancing recommendations based on APY spread and chain.
- **PredictiveAnalyticsService** → 7-day APY trajectory forecasting with TVL momentum indicators.
- **ZapOrchestratorService** → One-tap multi-step stake + recursive strategy attachment.
- **TreasuryService** → Protocol treasury holdings and fee tracking.
- **RevenueRouterService** → Fee harvesting cycle (stub: 1inch swap integration pending Phase 15).
- **CreditService** → Yield-backed credit position lifecycle (open, update, liquidate).
- **ReportService** → Tax-ready CSV export and FIFO P&L calculation.
- **GasService** → ERC-4337 Alchemy Paymaster sponsorship (wired, end-to-end test pending Phase 15).
- **SafeService** → Gnosis Safe proposal generation (stub: `@safe-global/protocol-kit` integration pending Phase 15).
- **BridgeService** → Cross-chain yield settlement (stub: Hyperlane/CCIP integration pending Phase 17).
- **PriceService** → CoinGecko price fetching with 1-minute in-memory cache.
- **NotificationService** → Socket.io alpha opportunity broadcasts.

## Smart Contract Suite (Solidity 0.8.24)

- **StakingPool** → Core staking, reward accrual, and claim logic.
- **StakingPoolFactory** → Permissionless pool deployment across chains.
- **W3B3Token** → Native governance and reward token.
- **W3B3Treasury** → Protocol-owned liquidity vault.
- **RevenueRouter** → Fee harvesting and ETH distribution to stakers.
- **W3B3CreditLine** → Yield-backed collateral borrowing with liquidation.
- **W3B3RestakingHub** → EigenLayer/cross-chain LST delegation abstraction.
- **W3B3AutonomousHarvester** → AI keeper-driven LST rebalancing via DEX router.
- **W3B3RewardDistributor** → Merkle-based reward distribution.
- **W3B3SubDAO** → Sub-governance module for protocol mandates.
- **W3B3PositionNFT** → Tokenized staking position receipts.
- **W3B3FlashStaking** → Flash loan-style single-block staking.
- **W3B3InsuranceWrapper** → Protocol insurance fund wrapper.
- **W3B3Stablecoin** → `$w3USD` stablecoin with seigniorage fee routing.

## Known Stubs (Phase 15 Targets)

| Service | Status |
|---|---|
| `RevenueRouterService.executeSwapToEth` | Stub — 1inch v6 integration pending |
| `SafeService.proposeInstitutionalStake` | Stub — `@safe-global/protocol-kit` pending |
| `BridgeService.settleCrossChainYield` | Stub — Hyperlane/CCIP pending (Phase 17) |
| `W3B3SDK.executeDeposit` | Mock tx hash — real contract wiring pending |
| `GovernanceService.castVote` | Not persisted — `GovernanceVote` model pending |
| `predictiveAnalytics` historical data | `Math.random()` — real time-series pending |
| `portfolioService` vault value | Hardcoded mock — on-chain balance reads pending |

---

Historical records in [CHANGELOG.md](./CHANGELOG.md).
Full roadmap in [IMPLEMENTATION_ROADMAP_V2.md](./IMPLEMENTATION_ROADMAP_V2.md).
