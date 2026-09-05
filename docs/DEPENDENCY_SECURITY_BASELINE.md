# Dependency Security Baseline — Phase 14

## Status

**ACTIVE / VERIFICATION-GATED**

This document records the repository state used for dependency-security remediation. It intentionally does not claim that a package is vulnerable without a reproducible audit result.

## Current repository state

- The repository is an npm workspace spanning `frontend`, `backend`, `contracts`, and `shared`.
- The root manifest requires Node `>=20.0.0` and npm `>=10.0.0`.
- The root `package-lock.json` is tracked and is approximately 1.52 MB. The Files connector cannot safely render its full contents because of its size, so resolved-package claims must come from an actual npm execution/audit rather than from partial file inspection.
- No separate `contracts/package-lock.json` is present; the root workspace lockfile is therefore the authoritative lockfile for the npm workspace.
- CI now uses `npm ci` rather than `npm install`, with npm dependency caching, so CI/release verification is tied to the committed lockfile.
- Direct security-sensitive versions already raised in the Phase 14 work include Axios `^1.19.0` and Next.js `^15.5.24`. Current public package metadata shows patched Axios releases in the 1.19.x/1.20.x line; no direct-version change is being made without regenerating and validating the lockfile.

## Confirmed external package observations

- Axios `1.19.0` is reported as having no direct known vulnerabilities by Snyk's current package-version view. A newer `1.20.0` release is also available. citeturn0search2
- Next.js `15.5.24` is still a published maintenance-line release, while the current latest major is 16.x. This project will not take an unnecessary major-version jump during Phase 14 hardening. citeturn0search0

These observations are **not** a substitute for the repository's resolved dependency audit.

## Remediation policy

1. Do not run or merge `npm audit fix --force` as a blanket remediation.
2. Establish the resolved dependency tree from the committed root lockfile.
3. Classify findings by direct/transitive path, severity, production reachability and available fixed version.
4. Group upgrades by compatible dependency family.
5. Prefer the smallest compatible upgrade that addresses a confirmed advisory.
6. Regenerate the root lockfile with the same supported Node/npm family after dependency changes.
7. Run the complete relevant test/build/security matrix after each upgrade group.
8. Record advisory IDs, affected package ranges, selected versions, and verification evidence before closing a security task.
9. Keep the Phase 14 security gate open while a reproducible high/critical audit result or its documented risk acceptance is outstanding.

## Immediate execution sequence

- [x] Record the current dependency-manifest/lockfile state.
- [x] Make CI dependency installation lockfile-reproducible with `npm ci`.
- [ ] Run `npm audit --omit=dev --audit-level=high` from a networked npm-capable environment.
- [ ] Identify confirmed high/critical production findings and their dependency paths.
- [ ] Apply minimal compatible upgrades where fixes exist.
- [ ] Regenerate and commit the authoritative lockfile after any upgrade.
- [ ] Run tests, builds, lint/type checks and security checks.
- [ ] Close the Phase 14 dependency gate only with evidence or explicit risk acceptance.

## Execution constraint

Repository access can inspect and modify tracked source, but a trustworthy npm audit requires executing package installation/audit commands against the repository's actual dependency graph. The current environment cannot reach the npm registry reliably, and GitHub Actions runtime is presently constrained. Therefore the dependency gate remains open rather than being falsely marked verified.

## Important distinction

A declared version in `package.json` is not proof of the resolved version installed in production. A public package-version security page is not proof of this repository's transitive dependency state. Conversely, an advisory reported by an audit is not sufficient reason to apply a breaking upgrade without checking the application's compatibility surface.
