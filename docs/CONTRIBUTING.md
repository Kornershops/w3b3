# Contributing to W3B3

Guidance and standards for extending the W3B3 platform.

## Development Workflow

### 1. Feature Lifecycle

Fork the Repository → Local environment setup.
Feature Branch → Branch naming: `feature/name` or `fix/name`.
Quality Check → Run full test suite: `npm run test`.
Commit Convention → Use `feat:`, `fix:`, `docs:`, `chore:`, etc.
Pull Request → Clear description and documentation required.

### 2. Implementation Standards

Frontend → Next.js 15 → Typed hooks and glassmorphic UI components.
Backend → Express → Clean service layer and JWT rotation.
Contracts → Solidity 0.8.24 → OpenZeppelin inheritance and Hardhat tests.

> Note: `CONTRIBUTING.md` previously referenced Next.js 14. The project target is Next.js 15 (`^15.5.24`) as of phase-14.

## Coding Standards

Strictly Typed → Forced TypeScript linting in all workspaces.
Security → Access-Refresh JWT rotation to minimize session hijack window.
Testing → Every feature requires a companion test suite.
Documentation → Update the local README and API docs for all exports.

## Active Stubs — Do Not Ship Without Completing

The following services are stubs and must not be treated as production-ready:

- `RevenueRouterService.executeSwapToEth` — 1inch v6 integration required (Phase 15)
- `SafeService.proposeInstitutionalStake` — `@safe-global/protocol-kit` integration required (Phase 15)
- `BridgeService.settleCrossChainYield` — Hyperlane/CCIP integration required (Phase 17)
- `W3B3SDK.executeDeposit` / `deployCustomVault` — real contract wiring required (Phase 15)
- `GovernanceService.castVote` — DB persistence required (Phase 14 carry-forward)

## Issues and Support

Bug Reports → Check existing issues before creating new reports.
Feature Requests → Provide clear business logic and use case.
Technical Discussion → Use GitHub Discussions for RFCs and queries.

---

Historical records are detailed in [CHANGELOG.md](./CHANGELOG.md).
Full roadmap in [IMPLEMENTATION_ROADMAP_V2.md](./IMPLEMENTATION_ROADMAP_V2.md).
