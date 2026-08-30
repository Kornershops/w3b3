# W3B3 Strategic Architecture

Structural overview of the W3B3 multi-chain portal and its production boundaries.

## Vision-Led Infrastructure

Every architectural decision supports the original mission of low-friction staking, real-yield access, institutional custody and progressive capital-efficiency strategies.

Interactive UI -> Premium Experience -> Next.js application with wallet-aware transaction states.
Wallet Context -> Multi-Chain Unified -> RainbowKit + Wagmi with chain-sync detection.
Backend API -> Resilient Scaling -> authenticated routes, service layer, Redis-backed discovery and operational controls.
Storage Layer -> Data Integrity -> relational PostgreSQL schema managed through Prisma.
Smart Contracts -> Protocol Security -> Solidity financial state, access control, oracle validation and emergency controls.

## Infrastructure Matrix

-> Deployment Hosting -> Frontend/backend deployment platforms -> reproducible CI/CD.
-> Blockchain Access -> RPC provider layer -> network-specific transaction/read access.
-> Database Persistence -> PostgreSQL -> structured application and governance data.
-> Cache & Real-Time -> Redis & Socket.io -> performance and live updates.

## Project Organization

/frontend -> Web Interface -> App Router, components, hooks and stores.
/backend -> Core API -> routes, controllers, services, middleware and database schema.
/contracts -> DeFi Logic -> staking, governance, custody, recursive and credit-line contracts.
/docs -> Knowledge Base -> roadmap, API, implementation specs, production gates and setup guides.

## Critical Design Principles

-> Frictionless Wallet UX -> automatic network handling and transaction-state visibility.
-> Institutional Trust -> multi-sig custody with explicit proposal/approval rails.
-> Keyless Analytics -> resilient public market-data ingestion with throttling and fallbacks.
-> Capital Efficiency -> recursive-yield simulation plus an on-chain execution invariant for unsafe states.
-> Protocol Mandate -> governance-derived weights and tiered loyalty multipliers.
-> Least Privilege -> keeper, governance, oracle and integration authorities are explicitly bounded.
-> Fail Closed -> invalid oracle observations, unauthorized assets and unsafe financial states block state changes.

## Advanced Service Layers

- **InstitutionalVaultService** -> multi-sig proposal, approval and weighted-threshold logic.
- **RecursiveYieldService** -> leverage strategy calculation, health-factor simulation and execution preparation.
- **GovernanceService** -> voting power, multiplier and governance persistence responsibilities.
- **ZapOrchestratorService** -> zero-friction transaction orchestration.
- **YieldResilienceHub** -> market-data resilience and uptime-oriented ingestion.

## Production Boundary Rules

### Simulation vs authorization

Backend services may calculate health factors and prepare strategies, but a financial state-changing transaction must enforce its safety invariant at the authoritative execution boundary. The current production gate requires minimum recursive health factor **1.12** to be proven at that boundary.

### Oracle architecture

Credit-line/restaking valuation uses an explicit price-oracle abstraction. Oracle observations must be valid at the time they are consumed; production readiness additionally requires authoritative feed, network, decimals, freshness and deployment evidence.

### Autonomous execution

Keeper-driven harvesting/rebalancing is constrained by keeper authorization, user opt-in and approved source/target assets. Router approvals use a bounded allowance lifecycle.

### Application vs production readiness

A service may be implemented and tested while still depending on production configuration, external-provider integration, deployment evidence or operational controls. Those are separate release gates.

## Phase Relationship

Phase 1–13 define the historical product foundation. Phase 14 hardens production security and financial safety. Phase 15 wires remaining runtime integrations. Phase 16 extends the experience to mobile. Phase 17 carries the cross-chain/app-chain vision.

See `IMPLEMENTATION_ROADMAP_V2.md` for phases, `ACTIVE_TASKS.md` for executable work, `PHASE_15_SPEC.md` for Phase 15 acceptance criteria, and `PRODUCTION_READINESS.md` for release evidence.

---

Historical records are detailed in `CHANGELOG.md`.
