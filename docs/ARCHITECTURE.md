# W3B3 Strategic Architecture

Structural overview of the W3B3 multi-chain portal.

## Vision-Led Infrastructure

Every architectural decision in W3B3 is designed to support the mission of zero-friction staking.

Interactive UI -> Premium Experience -> Next.js 14 SPA with real-time reward interpolation.
Wallet Context -> Multi-Chain Unified -> RainbowKit v2 + Wagmi v2 with chain-sync detection.
Backend API -> Resilient Scaling -> JWT secret rotation + Redis-backed pool discovery.
Storage Layer -> Data Integrity -> Relational Postgres schema managed via Prisma ORM.
Smart Contracts -> Protocol Security -> Audit-standard 0.8.24 Solidity with Pausable logic.

## Infrastructure Matrix

-> Deployment Hosting -> Vercel (Front) / Render (Back) -> High-availability CI/CD.
-> Blockchain Access -> Alchemy -> Unified multi-chain RPC node layer.
-> Database Persistence -> AWS RDS Postgres -> Structured data for users/stakes.
-> Cache & Real-Time -> Redis & Socket.io -> Performance and live updates.

## Project Organization

/frontend -> Web Interface -> App Router, Components, Hooks, and Stores.
/backend -> Core API -> Routes, Services, Middleware, and Database Schema.
/contracts -> DeFi Logic -> Staking Pool Factory and Governance contracts.
/docs -> Knowledge Base -> Deployment, API, and setup guides.

## Critical Design Principles

-> Frictionless Wallet UX -> Automatic network detection and switching for non-experts.
-> Security Centric -> Access-Refresh JWT rotation to minimize session hijack window.
-> Autonomous Scaling -> Pool and token factory patterns to onboard new assets in minutes.

---

Historical records are detailed in [CHANGELOG.md](./CHANGELOG.md).
