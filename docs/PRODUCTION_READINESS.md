# W3B3 Production Readiness Gate

## Purpose

This document is the release gate for W3B3. It preserves the original product blueprint while defining the evidence required before financial capabilities are treated as production-ready.

## Readiness model

### Implementation
Code, configuration or documentation exists and is integrated.

### Verification
Automated or operational evidence demonstrates the intended behavior under normal and adversarial conditions.

### Production readiness
Verification is complete, production configuration is authoritative, deployment provenance is known, operational controls exist, and unresolved risks have explicit approval.

> **Implementation is not certification.** A merge to `main` is not a production sign-off.

## Phase 14 exit gates

### P0 — Security and financial safety

- [ ] Resolved dependency inventory and reproducible security audit.
- [ ] Confirmed high/critical dependency findings remediated, mitigated or explicitly risk-accepted.
- [ ] Authoritative production oracle feeds, networks, decimals, freshness policy and addresses verified.
- [ ] Recursive minimum health factor **1.12** enforced at the actual state-changing/on-chain execution boundary.
- [ ] Yield-offset credit accounting requirements approved and implemented without invented semantics.
- [ ] Financial invariants tested for debt, collateral, yield, liquidation and rounding.

### P1 — Release engineering

- [ ] Full CI matrix passes or every exception has documented, approved rationale.
- [ ] Backend route/controller/service/persistence paths reconciled.
- [ ] Frontend wallet and transaction failure states verified.
- [ ] Deployment artifact and commit provenance recorded.
- [ ] Environment variables, migrations, contract addresses and health checks verified.
- [ ] Rollback/recovery procedure rehearsed.

### P2 — Governance and operations

- [ ] `main` branch protection and required checks configured.
- [ ] Secret/dependency scanning active.
- [ ] Monitoring and incident response controls documented.
- [ ] Historical phase completion claims reconciled where they affect production assurance.

## Security principles

1. **Least privilege:** keepers, governance roles and integrations receive only required authority.
2. **Fail closed:** invalid/stale oracle data, unauthorized assets and unsafe financial states must block state changes.
3. **Authoritative boundary:** critical financial invariants must be enforced where state changes become authoritative.
4. **Reproducibility:** lockfiles, builds, deployments and configuration must be attributable to known source revisions.
5. **Evidence over assertion:** “complete” means the required evidence exists, not merely that a function or test file exists.

## Critical pro tips

- Never solve a dependency audit by blindly forcing breaking upgrades.
- Never rely on backend simulation as a substitute for on-chain authorization.
- Never treat a mock, hardcoded balance, placeholder transaction hash or random analytics value as production functionality.
- Treat oracle feed selection, heartbeat and decimals as security-critical configuration.
- Test boundary values and adversarial paths, not only happy paths.
- Keep testnet/staging/mainnet evidence distinct.
- Record exact deployed addresses and source commits.
- Make emergency pause/rollback/recovery procedures part of the release plan.

## Original blueprint preservation

Production assurance does not remove or redesign W3B3's original direction: real-yield marketplace, liquidity aggregation, staking, autonomous harvesting, institutional custody, governance, recursive yield, yield-backed credit, analytics, mobile, cross-chain and eventual app-chain expansion remain the roadmap. The gate determines when each capability can safely graduate.

## Phase progression

**Phase 14:** production assurance → **Phase 15:** runtime completions/SDK hardening → **Phase 16:** mobile-first ecosystem → **Phase 17:** app-chain graduation.

Phase 15+ work may be planned and documented while Phase 14 remains open, but production certification cannot be inferred from starting a later phase.
