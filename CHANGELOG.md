# Changelog

All notable changes to the W3B3 project will be documented in this file.

## [1.1.0-alpha] - 2026-04-08

### Added
- **Internal Bootstrap API**: Implemented secure `/api/admin/bootstrap-data` endpoint for internal database seeding on Render.
- **PriceService**: Integrated real-time market data fetching for ETH, USDC, USDT, and stETH via CoinGecko.
- **Multi-Provider Fallback**: Implemented automatic switching between Alchemy and Infura to ensure 100% Web3 uptime.
- **Initial Database Schema**: Added Prisma migrations for core staking and user management tables.
- **Shared Workspace**: Established `@w3b3/shared` library for consistent logic across backend and frontend workspaces.

### Fixed
- **Render Build Pipeline**: Resolved monorepo build failures by optimizing the build command to respect workspace dependencies.
- **Dependency Conflicts**: Fixed `axios` and `prisma` versioning issues in the backend service.
- **Environment Safety**: Refactored `env.ts` to allow for optional Web3 keys and provide sensible defaults for non-critical secrets.

### Security
- **Admin Authentication**: Added `X-Admin-Secret` header validation for sensitive internal operations.
- **Environment Hardening**: Stabilized dual-JWT auth flow for production deployment.

## [1.0.0-conceptual] - 2026-03-21
- Initial scaffold of the Frictionless Multi-Chain Yield Portal.
- Visual design system with deep-dark glassmorphism.
- Basic API structure for Auth and Pools.
