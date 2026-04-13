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

## Enterprise & Institutional (V2)

GET  -> /reports/tax -> Tax Reporting -> Generates P&L CSV export (Auth Required).
POST -> /credit/borrow -> Open Credit Position -> Borrow assets against staked NFTs.
GET  -> /credit/positions -> My Credit -> Active loan health and collateral tracking.
GET  -> /ai/harvest -> Recommendations -> AI-driven yield optimization suggestions.
POST -> /safe/propose -> Multi-Sig Proposal -> Initiate Gnosis Safe institutional action.
GET  -> /compliance/status -> Verification -> KYC/Institutional verification context.

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
