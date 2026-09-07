# Phase 15 — Production Readiness

**Status:** ACTIVE / GATED  
**Phase 14:** complete and merged to `main`  
**Objective:** close the remaining production blockers and assemble auditable release evidence.

## Phase boundary

Phase 15 is assurance work. Feature expansion is deliberately deferred until the release gates are closed. Existing architecture and the original W3B3 blueprint remain intact; this phase adds evidence, safety and production-readiness gates around them.

## Exit criteria

Phase 15 can close only when all applicable P0/P1 items have:

1. authoritative implementation;
2. automated regression coverage;
3. deployment/configuration evidence;
4. operational evidence; and
5. an explicit go/no-go decision.

## Workstreams

### P0 — must close before production

| Workstream | Current state | Next gate |
|---|---|---|
| Dependency security | Open / environment-blocked | Fresh audit, remediation, lockfile + verification |
| Production oracle | Hardened / evidence-blocked | Authoritative network/feed + deployment/runtime evidence |
| Recursive execution safety | Guarded at credit-line boundary / architecture-blocked | Identify executor + enforce invariant there + adversarial tests |
| Yield-offset credit | Specification-blocked | Financial authority approval before implementation |

### P1 — release assurance

| Workstream | Current state | Next gate |
|---|---|---|
| Yield/analytics | Hardened against fabrication / adapter-blocked | Authoritative adapter + provenance/freshness tests |
| Production config/treasury | Hardened / verification-open | Environment/config tests + runtime verification |
| Transaction lifecycle | Primitives complete / integration-open | Discover call graph, integrate UI flows, E2E verification |
| Release verification | Open | CI matrix + provenance + migrations + rollback evidence |

## Sprint 15.01 handover

**Primary goal:** convert the hardened code baseline into an evidence-backed production candidate.

### Immediate tasks

- [ ] Reproduce dependency inventory with networked npm tooling and classify advisories.
- [ ] Establish authoritative oracle/network deployment inputs and capture evidence.
- [ ] Locate the actual state-changing recursive executor before modifying execution semantics.
- [ ] Obtain explicit financial/accounting approval for yield-offset credit.
- [ ] Implement the authoritative yield/pool adapter and its provenance contract.
- [ ] Add production configuration validation tests and verify deployment environments.
- [ ] Trace every frontend EOA/AA transaction call site and integrate lifecycle state without speculative API breakage.
- [ ] Run the release verification matrix when CI/package runtime capacity is available.
- [ ] Verify migrations, addresses, health/readiness, deployment provenance and rollback/recovery.
- [ ] Publish a release evidence pack and go/no-go decision.

## Guardrails for the next implementer

- Do not invent production contract addresses, oracle feeds, feed decimals, heartbeat limits, RPC endpoints or deployment evidence.
- Do not treat backend simulation as transaction authorization.
- Do not implement the yield-offset accounting proposal until the financial model is explicitly approved.
- Do not enable the current Sepolia-bound AA configuration for production.
- Do not replace missing authoritative financial data with mock/random/default values.
- Do not claim CI, deployment or runtime verification when the required environment was unavailable.
- Prefer small, independently verifiable commits and update `docs/ACTIVE_TASKS.md` after substantive gate changes.

## Evidence discipline

Use a clear distinction between **implemented**, **tested**, **verified**, and **production-approved**. A checked implementation item is not by itself a production approval.

## Handoff destination

When Sprint 15.01 closes, update this document and `docs/ACTIVE_TASKS.md` with the evidence-backed status. Only then activate the next production-readiness sprint or a later feature phase as appropriate.
