# Phase 14 Security Remediation Log

## Current finding

The dependency audit was converted from informational to a hard CI gate. The first gated run exposed a production dependency vulnerability backlog rather than allowing CI to pass.

## Remediation policy

- Do not use `npm audit fix --force` blindly.
- Upgrade dependency families in compatible groups.
- After each group: install, lint/typecheck, backend tests, frontend tests, contract tests, and build.
- Re-run production dependency audit.
- Record breaking changes separately before accepting them.

## Recursive-risk remediation

The recursive controller/service now has explicit validation for authenticated user, strategy ID, amount, leverage, and strategy maximum leverage. These changes remain open until the new branch head passes CI and dedicated tests.

## Release gate

Phase 14 cannot pass while high/critical production dependency findings remain unexplained, except where a documented risk acceptance explicitly records affected package, exploitability, mitigation, owner and review date.
