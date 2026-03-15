# W3B3 API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## Endpoints

### Authentication

#### Connect Wallet
```
POST /auth/connect
```

**Request:**
```json
{
  "walletAddress": "0x...",
  "signature": "0x...",
  "message": "Sign this message to connect"
}
```

**Response:**
```json
{
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "walletAddress": "0x...",
    "chainId": 1
  }
}
```

#### Logout
```
POST /auth/logout
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

#### Get Current User
```
GET /auth/user
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "uuid",
  "walletAddress": "0x...",
  "chainId": 1,
  "createdAt": "2026-03-15T10:00:00Z"
}
```

---

### Pools

#### List All Pools
```
GET /pools
```

**Query Parameters:**
- `chain` (optional): Filter by chain ID (1, 137, 501, 8453)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `sort` (optional): Sort by field (apy, tvl, name)
- `order` (optional): Sort order (asc, desc)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "USDC Staking",
      "chainId": 1,
      "contractAddress": "0x...",
      "tokenSymbol": "USDC",
      "tokenDecimals": 6,
      "apyPercentage": "12.50",
      "tvlAmount": "2300000.00000000",
      "minimumStake": "100.00000000",
      "isActive": true,
      "createdAt": "2026-03-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

#### Get Pool Details
```
GET /pools/:id
```

**Response:**
```json
{
  "id": "uuid",
  "name": "USDC Staking",
  "chainId": 1,
  "contractAddress": "0x...",
  "tokenSymbol": "USDC",
  "tokenDecimals": 6,
  "apyPercentage": "12.50",
  "tvlAmount": "2300000.00000000",
  "minimumStake": "100.00000000",
  "isActive": true,
  "createdAt": "2026-03-15T10:00:00Z",
  "updatedAt": "2026-03-15T10:00:00Z"
}
```

#### Get Pool APY
```
GET /pools/:id/apy
```

**Response:**
```json
{
  "poolId": "uuid",
  "currentApy": "12.50",
  "previousApy": "12.30",
  "change": "+0.20",
  "lastUpdated": "2026-03-15T10:00:00Z"
}
```

---

### Stakes

#### Get User's Stakes
```
GET /stakes
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "poolId": "uuid",
      "amountStaked": "1000.00000000",
      "rewardsClaimed": "12.50000000",
      "transactionHash": "0x...",
      "stakedAt": "2026-03-15T10:00:00Z",
      "unstakedAt": null,
      "isActive": true,
      "pool": {
        "id": "uuid",
        "name": "USDC Staking",
        "tokenSymbol": "USDC",
        "apyPercentage": "12.50"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "pages": 1
  }
}
```

#### Get Single Stake
```
GET /stakes/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "poolId": "uuid",
  "amountStaked": "1000.00000000",
  "rewardsClaimed": "12.50000000",
  "currentRewards": "0.34000000",
  "transactionHash": "0x...",
  "stakedAt": "2026-03-15T10:00:00Z",
  "unstakedAt": null,
  "isActive": true,
  "pool": {
    "id": "uuid",
    "name": "USDC Staking",
    "tokenSymbol": "USDC",
    "apyPercentage": "12.50",
    "chainId": 1
  }
}
```

#### Claim Rewards
```
POST /stakes/claim
Authorization: Bearer <token>
```

**Request:**
```json
{
  "stakeId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Rewards claimed successfully",
  "amount": "12.50000000",
  "transactionHash": "0x...",
  "claimedAt": "2026-03-15T10:00:00Z"
}
```

---

### Portfolio

#### Get Portfolio Summary
```
GET /portfolio
Authorization: Bearer <token>
```

**Response:**
```json
{
  "totalStaked": "5000.00000000",
  "totalRewards": "125.30000000",
  "netGain": "2.51",
  "estimatedAnnual": "625.00000000",
  "activeStakes": 3,
  "totalStakes": 5,
  "lastUpdated": "2026-03-15T10:00:00Z"
}
```

#### Get Portfolio Breakdown
```
GET /portfolio/breakdown
Authorization: Bearer <token>
```

**Response:**
```json
{
  "byChain": [
    {
      "chainId": 1,
      "chainName": "Ethereum",
      "totalStaked": "2000.00000000",
      "totalRewards": "50.00000000",
      "percentage": 40
    },
    {
      "chainId": 137,
      "chainName": "Polygon",
      "totalStaked": "3000.00000000",
      "totalRewards": "75.30000000",
      "percentage": 60
    }
  ],
  "byAsset": [
    {
      "symbol": "USDC",
      "totalStaked": "3500.00000000",
      "totalRewards": "87.50000000",
      "percentage": 70
    },
    {
      "symbol": "MATIC",
      "totalStaked": "1500.00000000",
      "totalRewards": "37.80000000",
      "percentage": 30
    }
  ]
}
```

#### Get Transaction History
```
GET /portfolio/history
Authorization: Bearer <token>
```

**Query Parameters:**
- `type` (optional): Filter by type (stake, unstake, claim)
- `startDate` (optional): Start date (ISO 8601)
- `endDate` (optional): End date (ISO 8601)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "type": "stake",
      "amount": "1000.00000000",
      "token": "USDC",
      "chainId": 1,
      "transactionHash": "0x...",
      "status": "confirmed",
      "timestamp": "2026-03-15T10:00:00Z"
    },
    {
      "id": "uuid",
      "type": "claim",
      "amount": "12.50000000",
      "token": "USDC",
      "chainId": 1,
      "transactionHash": "0x...",
      "status": "confirmed",
      "timestamp": "2026-03-15T10:05:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "pages": 1
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid input parameters",
  "details": {
    "field": "error message"
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Try again later."
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

---

## Rate Limiting

- **Default:** 100 requests per 15 minutes per IP
- **Authenticated:** 1000 requests per 15 minutes per user
- **Headers:**
  - `X-RateLimit-Limit`: Total requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Unix timestamp when limit resets

---

## WebSocket Events

### Connection
```javascript
const socket = io('http://localhost:3001');

socket.on('connect', () => {
  console.log('Connected');
});
```

### Pool Updates
```javascript
socket.on('pool:update', (data) => {
  console.log('Pool updated:', data);
  // {
  //   poolId: 'uuid',
  //   apy: '12.50',
  //   tvl: '2300000.00000000',
  //   timestamp: '2026-03-15T10:00:00Z'
  // }
});
```

### Reward Accrual
```javascript
socket.on('reward:accrued', (data) => {
  console.log('Reward accrued:', data);
  // {
  //   stakeId: 'uuid',
  //   amount: '0.00157',
  //   totalRewards: '12.50157',
  //   timestamp: '2026-03-15T10:00:00Z'
  // }
});
```

### Transaction Confirmation
```javascript
socket.on('transaction:confirmed', (data) => {
  console.log('Transaction confirmed:', data);
  // {
  //   transactionHash: '0x...',
  //   type: 'stake',
  //   status: 'confirmed',
  //   timestamp: '2026-03-15T10:00:00Z'
  // }
});
```

---

## Examples

### JavaScript/TypeScript

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// Connect wallet
const connectWallet = async (walletAddress, signature, message) => {
  const response = await api.post('/auth/connect', {
    walletAddress,
    signature,
    message,
  });
  return response.data;
};

// Get pools
const getPools = async (chainId) => {
  const response = await api.get('/pools', {
    params: { chain: chainId },
  });
  return response.data;
};

// Get user stakes
const getUserStakes = async (token) => {
  const response = await api.get('/stakes', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
```

### cURL

```bash
# Connect wallet
curl -X POST http://localhost:3001/api/auth/connect \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x...",
    "signature": "0x...",
    "message": "Sign this message"
  }'

# Get pools
curl http://localhost:3001/api/pools?chain=1

# Get user stakes
curl http://localhost:3001/api/stakes \
  -H "Authorization: Bearer <token>"
```

---

## Changelog

### v1.0.0 (2026-03-15)
- Initial API release
- Authentication endpoints
- Pool discovery endpoints
- Staking endpoints
- Portfolio endpoints
- WebSocket support
