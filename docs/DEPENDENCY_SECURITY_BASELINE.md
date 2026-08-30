# Dependency Security Baseline — Phase 14

## Status

**ACTIVE / VERIFICATION-GATED**

This document records the repository state used for dependency-security remediation. It intentionally does not claim that a package is vulnerable without a reproducible audit result.

## Findings from repository state

- The repository is an npm workspace spanning `frontend`, `backend`, `contracts`, and `shared`.
- The root manifest requires Node `>=20.0.0` and npm `>=10.0.0`.
- The contracts workspace requires Node `>=20.0.0` and npm `>=10.0.0`.
- The root `package-lock.json` exists as an empty tracked file on the Phase 14 branch, so it cannot currently serve as a trustworthy resolved-dependency inventory.
- No contracts lockfile was found at `contracts/package-lock.json` on the Phase 14 branch.

## Remediation policy

1. Do not run or merge `npm audit fix --force` as a blanket remediation.
2. Establish resolved dependency trees for each workspace before changing versions.
3. Group upgrades by compatible dependency family.
4. Prefer the smallest compatible upgrade that addresses the confirmed advisory.
5. Run the complete relevant test/build/security matrix after each upgrade group.
6. Record advisory IDs, affected package ranges, selected versions, and verification evidence before closing a security task.
7. Keep CI-gated security verification open while GitHub Actions runtime is unavailable.

## Immediate execution sequence

- [x] Record the current dependency-manifest/lockfile state.
- [ ] Generate a reproducible audit from a fresh dependency installation when an npm-capable execution environment is available.
- [ ] Identify confirmed high/critical production findings and their dependency families.
- [ ] Apply minimal compatible upgrades.
- [ ] Regenerate and commit authoritative lockfiles.
- [ ] Run tests, builds, lint/type checks and security checks.
- [ ] Close the Phase 14 dependency gate only with evidence.

## Execution constraint

GitHub repository access can inspect and modify tracked source, but a trustworthy npm audit requires executing package installation and audit commands against the repository's actual dependency graph. Without an npm-capable execution environment, declaring remediation from manifest versions alone would be misleading.

## Important distinction

A declared version in `package.json` is not, by itself, proof of the resolved version installed in production. Conversely, an advisory reported by an audit is not sufficient reason to apply a breaking upgrade without checking the application's compatibility surface.

Until a reproducible audit result exists, the dependency-security item remains **open** rather than being marked fixed or verified.
