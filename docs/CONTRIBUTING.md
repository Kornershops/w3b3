# Contributing to W3B3

Guidance and standards for extending the W3B3 platform.

## Development Workflow

### 1. Feature Lifecycle

Fork the Repository -> Local environment setup.
Feature Branch -> Branch naming: feature/name or fix/name.
Quality Check -> Run full test suite: npm run test.
Commit Convention -> Use feat:, fix:, docs:, etc.
Pull Request -> Clear documentation and description required.

### 2. Implementation Standards

Frontend -> Next.js 14 -> Typed hooks and glassmorphic UI components.
Backend -> Express -> Clean service layer and JWT rotation.
Contracts -> Solidity -> OpenZeppelin inheritance and Hardhat tests.

## Coding Standards

Strictly Typed -> Forced TypeScript linting in all workspaces.
Security -> Access-Refresh JWT rotation to minimize session hijack window.
Testing -> Every feature requires a companion test suite.
Documentation -> Update the local README and API docs for all exports.

## Issues and Support

Bug Reports -> Check existing issues before creating new reports.
Feature Requests -> Provide clear business logic and use case.
Technical Discussion -> Use GitHub Discussions for RFCs and queries.

---

Historical records are detailed in [CHANGELOG.md](./CHANGELOG.md).
