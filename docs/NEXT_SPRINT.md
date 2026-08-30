# W3B3 Next Sprint — Execution Plan

## Sprint 14.08 — Production Security & Financial Safety

**Phase:** 14 — Production Assurance  
**Status:** ACTIVE / GATED  
**Working branch:** `phase-14/production-assurance`  
**Phase 15:** GATED

### Sprint objective

Reduce the remaining production blockers with evidence-backed implementation and verification. Do not convert implementation into a PASS without automated or operational evidence.

### Execution order

#### P0 — Financial and security blockers

1. **Dependency security**
   - Establish resolved dependency inventories in an npm-capable environment.
   - Generate reproducible audits for root/workspaces.
   - Remediate confirmed high/critical findings by compatible dependency families.
   - Avoid blind major-version or `npm audit fix --force` changes.
   - Regenerate authoritative lockfiles and re-run the complete application/contract test matrix after each upgrade group.

2. **Credit-line oracle**
   - Verify hardened oracle behavior against the intended production feed/network.
   - Confirm deployment configuration and feed addresses from authoritative sources.
   - Capture integration evidence when Actions/runtime is available.

3. **Yield-offset credit**
   - Recover the authoritative product/protocol requirements.
   - Map the specified accounting model into the existing credit-line architecture.
   - Implement only the specified semantics.
   - Add adversarial financial-invariant tests for accounting, debt, collateral and liquidation behavior.

4. **Recursive execution safety**
   - Locate the real transaction/execution path behind recursive actions.
   - Enforce the 1.12 health-factor requirement at the actual authorization/execution boundary.
   - Prove that backend simulation cannot be mistaken for transaction authorization.

#### P1 — Release assurance

5. Fresh CI verification: lint/typecheck, backend, contracts, frontend, build and security.
6. Backend route → controller → service → test reconciliation.
7. Frontend wallet/transaction failure-state verification.
8. Deployment provenance, environment, migrations, health and contract-address verification.
9. Rollback/recovery verification.

#### P2 — Governance and historical evidence

10. `main` branch protection and required checks.
11. Secret/dependency scanning, monitoring and incident controls.
12. Evidence-level reconciliation of Phase 1–13 completion claims.

### Current implementation already delivered

- Explicit `IPriceOracle` credit-line boundary.
- Chainlink normalization and stale/future/incomplete/invalid observation checks.
- Oracle contract-code validation and governance rotation checks.
- Runtime validation of zero/future oracle observations during valuation.
- Credit-line regression coverage for LTV, withdrawal, repayment, liquidation, interest, access control and amount guards.
- Recursive request validation and strategy maximum-leverage enforcement.
- Recursive controller regression coverage through the actual backend Jest discovery path.
- CI dependency audit converted to a hard release gate.
- Dependency-security baseline and reproducible-audit execution policy.
- Deployment oracle preflight requirements.

### Verification constraint

GitHub Actions runtime exhaustion is an infrastructure constraint. It does not change the Definition of Done. CI-dependent tasks remain open until a fresh applicable run is available.

### Definition of Done

A task is closed only when implementation exists **and** appropriate automated/operational evidence exists. Production financial/security controls additionally require adversarial and deployment/runtime evidence where applicable.

### Phase gate

**Phase 14 remains ACTIVE/GATED. Phase 15 must not begin until all P0/P1 blockers have evidence-backed closure or explicit documented risk acceptance.**
