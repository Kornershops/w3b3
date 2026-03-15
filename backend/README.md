# W3B3 Backend

Express.js + TypeScript + PostgreSQL + Prisma + Redis

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm 10+
- PostgreSQL 14+
- Redis 7+

### Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Setup database
npx prisma migrate dev

# Start development server
npm run dev
```

### Access
- Backend API: http://localhost:3001
- API Docs: http://localhost:3001/api-docs

## 📁 Project Structure

```
src/
├── config/       # Configuration files
├── routes/       # API routes
├── controllers/  # Route handlers
├── services/     # Business logic
├── middleware/   # Express middleware
├── types/        # TypeScript types
└── utils/        # Utility functions

prisma/
├── schema.prisma # Database schema
└── migrations/   # Database migrations

tests/
├── unit/         # Unit tests
└── integration/  # Integration tests
```

## 🛠️ Available Commands

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run test             # Run tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report
npm run lint            # Run ESLint
npm run format          # Format code with Prettier
npm run type-check      # Check TypeScript types
npm run clean           # Clean build artifacts
npm run db:migrate      # Run database migrations
npm run db:seed         # Seed database with test data
npm run db:reset        # Reset database
```

## 📦 Dependencies

### Core
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM

### Database
- **PostgreSQL** - Database
- **Redis** - Caching

### Web3
- **ethers.js** - Ethereum library
- **Alchemy SDK** - RPC provider

### Authentication
- **JWT** - Token-based auth
- **Passport.js** - Authentication middleware
- **bcryptjs** - Password hashing

### Security
- **Helmet** - Security headers
- **CORS** - Cross-origin requests
- **express-rate-limit** - Rate limiting

### Real-time
- **Socket.io** - WebSocket server

### Utilities
- **axios** - HTTP client
- **date-fns** - Date utilities
- **lodash** - Utility functions
- **zod** - Schema validation
- **winston** - Logging
- **morgan** - HTTP request logger

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📝 Code Style

- **Linting:** ESLint with TypeScript support
- **Formatting:** Prettier
- **Type Checking:** TypeScript strict mode

```bash
npm run lint      # Check code style
npm run format    # Auto-format code
npm run type-check # Check types
```

## 🔐 Environment Variables

Create `.env` file:

```bash
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://postgres:password@localhost:5432/w3b3
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secret_key
ALCHEMY_API_KEY=your_alchemy_key
CORS_ORIGIN=http://localhost:3000
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/connect` - Connect wallet
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/user` - Get current user

### Pools
- `GET /api/pools` - List all pools
- `GET /api/pools?chain=1` - Filter by chain
- `GET /api/pools/:id` - Get pool details
- `GET /api/pools/:id/apy` - Get current APY

### Stakes
- `GET /api/stakes` - Get user's stakes
- `GET /api/stakes/:id` - Get single stake
- `POST /api/stakes/claim` - Claim rewards

### Portfolio
- `GET /api/portfolio` - Portfolio summary
- `GET /api/portfolio/breakdown` - Breakdown by chain
- `GET /api/portfolio/history` - Transaction history

## 🚀 Deployment

### Railway

```bash
# Connect to Railway
railway link

# Deploy
railway up
```

### Render

```bash
# Connect GitHub repository
# Deploy from Render dashboard
```

### AWS EC2

```bash
# Build
npm run build

# Start
npm run start
```

## 📚 Documentation

- [Express.js Docs](https://expressjs.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [ethers.js Docs](https://docs.ethers.org)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details
