# W3B3 Institutional: The Real-Yield Railroad

W3B3 is a high-fidelity, enterprise-grade **Liquidity Aggregator** and **Recursive Yield Hub**. Designed for "No-Messy-Zone" capital deployment, W3B3 provides institutional-grade analytics and multi-sig custody for a curated registry of the world's highest-liquidity digital assets.

## 🏛️ Platinum Features (V3 Certified)
- [x] **Aggregated Inventory**: 35 Blue-Chip assets across BTC, ETH, SOL, and Liquid Staking Derivatives.
- [x] **Institutional Custody**: Native Multi-Sig Vaults with weighted governance and proposal/approval rails.
- [x] **Capital Efficiency Engine**: Integrated Recursive Yield strategies with real-time health factor simulation.
- [x] **Keyless Analytics Suite**: Resilient CoinGecko data ingestion (Zero API Keys required).
- [x] **Governance Mandate**: Stake $W3B3 to direct protocol rewards and unlock up to 1.5x Yield Multipliers.

## 🛠️ Performance Architecture
- [x] **Global Portfolio Aggregator**: Unified Net Worth calculation integrating personal and institutional holdings.
- [x] **Throttled Sync Engine**: Safe backend market data ingestion optimized for public API rate limits.
- [x] **Recursive Safety Guardrails**: Strategy execution strictly enforced at a minimum 1.12 Health Factor.
- [x] **Institutional KYB/AML Rails**: Ready for enterprise onboarding and business entity verification.

## 🚦 Current Status

**Phase 14 — Production Assurance** is the active gate. The `origin/phase-14/production-assurance` branch (~80 commits ahead of `main`) contains all security hardening and is pending merge after two CI blockers are resolved:

1. Next.js 15 `PageProps` async params fix in `pool/[id]/page.tsx`
2. 38 high/critical transitive dependency vulnerabilities in the audit gate

All test jobs (backend, contracts, frontend, lint/typecheck) are passing on the phase-14 branch.

**Phase 15 — Runtime Completions** is next. It wires all remaining stub services (1inch swap, Safe SDK, ERC-4337 paymaster, SDK deposits, governance persistence) to real implementations. See [PHASE_15_SPEC.md](./docs/PHASE_15_SPEC.md).

---

## 📚 Documentation

| Doc | Description |
|---|---|
| [API.md](./docs/API.md) | Full API reference |
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System architecture and service layer |
| [CHANGELOG.md](./docs/CHANGELOG.md) | Release history and active sprint status |
| [IMPLEMENTATION_ROADMAP_V2.md](./docs/IMPLEMENTATION_ROADMAP_V2.md) | Full phase roadmap |
| [PHASE_15_SPEC.md](./docs/PHASE_15_SPEC.md) | Phase 15 sprint-by-sprint implementation spec |
| [TREASURY_AND_TOKENOMICS.md](./docs/TREASURY_AND_TOKENOMICS.md) | POL model and tokenomics |
| [YIELD_CREDIT_SPEC.md](./docs/YIELD_CREDIT_SPEC.md) | Yield-backed credit spec and implementation status |
| [INSTALL.md](./docs/INSTALL.md) | Local setup and environment guide |
| [PROJECT_BRIEF.md](./docs/PROJECT_BRIEF.md) | Executive project status brief |
