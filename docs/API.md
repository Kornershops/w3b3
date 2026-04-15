# W3B3 Unified API Reference

Base URL -> http://localhost:3001/api

## Authentication Layer

Protected endpoints require a JWT in the Authorization header: `Authorization: Bearer <token>`

POST -> /auth/connect -> Wallet Sign-in -> { token, refreshToken, user, referralPoints }.
POST -> /auth/refresh -> Token Rotation -> { token } (requires valid refreshToken).
GET -> /auth/user -> Profile Context -> { userId, walletAddress, points }.
POST -> /auth/logout -> Session Termination -> { message: "Success" }.

## Discovery & Staking

GET -> /pools -> List Pools -> Paginated array of available staking pools.
GET -> /pools/:id -> Pool Details -> Full metadata for a specific pool.
GET -> /stakes -> My Stakes -> Active and historical positions for current user.
POST -> /stakes -> Create Stake -> Initialize on-chain verified position.
POST -> /stakes/:id/unstake -> Unstake tokens -> Mark position as closed with tx hash.

## Portfolio & Growth

GET -> /portfolio -> Summary -> Total TVL, earned rewards, and performance net.
GET -> /portfolio/breakdown -> Asset Matrix -> Breakdown by chain and token ticker.
GET -> /users/leaderboard -> Leaderboard -> Global referral point rankings.

## Institutional & Governance (V3 Certified)

GET  -> /vaults/my -> My Vaults -> Fetch multi-sig vaults where user is owner/signer.
POST -> /vaults/create -> Create Vault -> Initialize new multi-sig container with threshold.
POST -> /vaults/propose -> Create Proposal -> Initiate a custody action (Rebalance/Stake).
POST -> /vaults/approve -> Approve Action -> Cast multi-sig signature for a proposal.

GET  -> /recursive/strategies -> Yield Loops -> List leverage-based capital efficiency strategies.
POST -> /recursive/simulate -> Strategy Simulation -> Calculate net APY and health factor.

POST -> /zaps/alpha -> Alpha Entry -> One-tap multi-step staking + recursive setup.

GET  -> /governance/power -> Protocol Mandate -> Fetch user voting power and yield tier.
POST -> /governance/vote -> Cast Mandate -> Influence protocol-wide yield weights.

GET  -> /yield/stats -> Marketplace Intel -> Global real-time TVL and APY analytics.

## Error Responses

401 -> Unauthorized -> Missing/Invalid Token -> Expired session or bad signature.
403 -> Forbidden -> Access Denied -> Attempting to modify another user's stake.
429 -> Rate Limit -> Too Many Requests -> Exceeded 100 req / 15 min per IP.
500 -> Server Error -> Internal Failure -> Database timeout or unhandled exception.

## WebSocket Events

-> pool:update -> Broadcasts live APY/TVL changes to all clients.
-> reward:accrued -> Real-time reward updates for individual stakes.
-> transaction:confirmed -> Status confirmation after on-chain verification.

---

Historical records and overhaul details are maintained in [CHANGELOG.md](./CHANGELOG.md).
