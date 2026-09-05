# Oracle Production Evidence Gate

**Phase:** 14 — Production Assurance  
**Gate:** P0-2 Production Oracle  
**Status:** OPEN — external deployment evidence required

## Purpose

This document is the canonical evidence checklist for approving a credit-line price oracle for testnet or production. Repository code defines validation behavior; it does **not** establish which feed, network, address, heartbeat, or deployment is authoritative.

## Required manifest

Every approved environment must record:

| Field | Required evidence |
|---|---|
| `environment` | `testnet` or `production` |
| `network` | Human-readable network name |
| `chainId` | On-chain chain ID |
| `asset` | Collateral asset and quote denomination |
| `feedAddress` | Authoritative oracle feed address |
| `feedDecimals` | Feed's on-chain decimals |
| `heartbeatSeconds` | Authoritative feed heartbeat/freshness expectation |
| `maxAgeSeconds` | Contract-enforced freshness limit |
| `oracleAddress` | Deployed `ChainlinkPriceOracle` address |
| `deploymentTx` | Deployment transaction hash |
| `deploymentBlock` | Deployment block number |
| `verifiedAt` | Timestamp of evidence capture |
| `source` | Authoritative provider/network documentation or deployment record |

Do not fill these values from memory, examples, or an unauthoritative aggregator. Production approval requires evidence from the selected network/provider and the actual deployment.

## Repository enforcement

`ChainlinkPriceOracle` rejects zero/negative prices, future observations, stale observations, and incomplete rounds, and normalizes feed values to 18 decimals. The credit-line contract also rejects a missing oracle contract and validates that the oracle can return a live observation. See the oracle and credit-line implementations for the executable controls.

The credit-line deployment preflight additionally requires an explicit expected chain ID, oracle feed address, and oracle `maxAge`, then verifies the live feed code and observation before deployment. This prevents a deployment from silently targeting a different chain, feed, or freshness policy.

## Approval checklist

- [ ] Authoritative network selected.
- [ ] Authoritative feed selected for the exact collateral/quote pair.
- [ ] Feed address independently checked on the target chain.
- [ ] Feed decimals captured from the live feed.
- [ ] Provider heartbeat captured from authoritative documentation.
- [ ] Contract `maxAge` approved as compatible with the heartbeat and operational risk.
- [ ] `ChainlinkPriceOracle` deployment address captured.
- [ ] Credit-line deployment address captured.
- [ ] Deployment transaction and block captured.
- [ ] Runtime environment values match the approved manifest.
- [ ] Live observation, freshness and round integrity verified after deployment.
- [ ] Explorer/source verification captured where supported.
- [ ] Security/operations owner signs off before production use.

## Current blocker

No production feed/network/address manifest is approved in this repository yet. This is intentional: inventing or copying a feed address without deployment evidence would create false production assurance.

**Gate rule:** P0-2 remains OPEN until the completed manifest and deployment evidence are attached to the release record. Code-level validation alone is not a production PASS.
