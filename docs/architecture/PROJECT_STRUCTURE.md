# W3B3 Project Structure & Setup

---

## 📁 Directory Structure

```
w3b3/
├── frontend/                    # Next.js React application
│   ├── src/
│   │   ├── app/                # Next.js app directory
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── globals.css
│   │   ├── components/         # Reusable components
│   │   │   ├── Navbar.tsx
│   │   │   ├── WalletConnect.tsx
│   │   │   ├── PoolCard.tsx
│   │   │   ├── StakingForm.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useWallet.ts
│   │   │   ├── useStaking.ts
│   │   │   └── usePortfolio.ts
│   │   ├── stores/             # Zustand stores
│   │   │   ├── userStore.ts
│   │   │   ├── poolStore.ts
│   │   │   └── portfolioStore.ts
│   │   ├── services/           # API services
│   │   │   ├── api.ts
│   │   │   ├── web3.ts
│   │   │   └── socket.ts
│   │   ├── types/              # TypeScript types
│   │   │   └── index.ts
│   │   └── utils/              # Utility functions
│   │       ├── format.ts
│   │       └── validation.ts
│   ├── public/                 # Static assets
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── next.config.js
│   └── README.md
│
├── backend/                     # Express.js API
│   ├── src/
│   │   ├── index.ts            # Entry point
│   │   ├── config/             # Configuration
│   │   │   ├── database.ts
│   │   │   ├── redis.ts
│   │   │   └── env.ts
│   │   ├── routes/             # API routes
│   │   │   ├── auth.ts
│   │   │   ├── pools.ts
│   │   │   ├── stakes.ts
│   │   │   └── portfolio.ts
│   │   ├── controllers/        # Route handlers
│   │   │   ├── authController.ts
│   │   │   ├── poolController.ts
│   │   │   ├── stakeController.ts
│   │   │   └── portfolioController.ts
│   │   ├── services/           # Business logic
│   │   │   ├── authService.ts
│   │   │   ├── poolService.ts
│   │   │   ├── stakeService.ts
│   │   │   ├── web3Service.ts
│   │   │   └── cacheService.ts
│   │   ├── middleware/         # Express middleware
│   │   │   ├── auth.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── validation.ts
│   │   ├── models/             # Prisma models (in schema.prisma)
│   │   ├── types/              # TypeScript types
│   │   │   └── index.ts
│   │   └── utils/              # Utility functions
│   │       ├── logger.ts
│   │       └── helpers.ts
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── migrations/         # Database migrations
│   ├── tests/                  # Test files
│   │   ├── unit/
│   │   └── integration/
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.js
│   └── README.md
│
├── contracts/                   # Solidity smart contracts
│   ├── contracts/
│   │   ├── StakingPool.sol
│   │   ├── RewardDistribution.sol
│   │   └── interfaces/
│   │       └── IStakingPool.sol
│   ├── scripts/
│   │   ├── deploy.js
│   │   └── verify.js
│   ├── test/
│   │   ├── StakingPool.test.js
│   │   └── RewardDistribution.test.js
│   ├── hardhat.config.js
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── docs/                        # Documentation
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT.md
│   └── SECURITY.md
│
├── .github/
│   └── workflows/
│       ├── ci.yml              # CI/CD pipeline
│       └── deploy.yml          # Deployment workflow
│
├── .gitignore
├── .env.example
├── package.json                # Root monorepo package.json
├── SPRINT_PLAN.md              # Sprint planning document
├── TECH_STACK.md               # Technology stack documentation
├── README.md                   # Project overview
└── LICENSE                     # MIT License
```

---

## 📦 Root package.json (Monorepo)

```json
{
  "name": "w3b3",
  "version": "1.0.0",
  "description": "Multi-Chain Staking & Yield Portal",
  "private": true,
  "workspaces": [
    "frontend",
    "backend",
    "contracts"
  ],
  "scripts": {
    "dev": "npm run dev --workspaces",
    "dev:frontend": "npm run dev --workspace=frontend",
    "dev:backend": "npm run dev --workspace=backend",
    "dev:contracts": "npm run dev --workspace=contracts",
    "build": "npm run build --workspaces",
    "build:frontend": "npm run build --workspace=frontend",
    "build:backend": "npm run build --workspace=backend",
    "build:contracts": "npm run build --workspace=contracts",
    "test": "npm run test --workspaces",
    "test:frontend": "npm run test --workspace=frontend",
    "test:backend": "npm run test --workspace=backend",
    "test:contracts": "npm run test --workspace=contracts",
    "lint": "npm run lint --workspaces",
    "format": "npm run format --workspaces",
    "clean": "npm run clean --workspaces && rm -rf node_modules",
    "install-all": "npm install && npm install --workspaces"
  },
  "devDependencies": {
    "husky": "^8.0.0",
    "lint-staged": "^15.0.0"
  },
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=10.0.0"
  }
}
```

---

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/w3b3.git
cd w3b3
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
```bash
# Copy example files
cp .env.example .env
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
cp contracts/.env.example contracts/.env
```

### 4. Setup Database
```bash
cd backend
npx prisma migrate dev
cd ..
```

### 5. Start Development Servers
```bash
# Terminal 1: Frontend
npm run dev:frontend

# Terminal 2: Backend
npm run dev:backend

# Terminal 3: Smart Contracts (optional)
npm run dev:contracts
```

### 6. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Docs: http://localhost:3001/api-docs

---

## 🔧 Development Workflow

### Creating a New Feature

1. **Create feature branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make changes** in appropriate workspace
```bash
# Frontend changes
cd frontend
npm run dev

# Backend changes
cd backend
npm run dev

# Contract changes
cd contracts
npm run test
```

3. **Run tests**
```bash
npm run test
```

4. **Format code**
```bash
npm run format
```

5. **Commit changes**
```bash
git add .
git commit -m "feat: add your feature description"
```

6. **Push and create PR**
```bash
git push origin feature/your-feature-name
```

---

## 📋 Environment Variables

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WC_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
NEXT_PUBLIC_ENVIRONMENT=development
```

### Backend (.env)
```bash
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/w3b3
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=15m
ALCHEMY_API_KEY=your_alchemy_api_key
ALCHEMY_WEBHOOK_SIGNING_KEY=your_webhook_key
CORS_ORIGIN=http://localhost:3000
```

### Smart Contracts (.env)
```bash
PRIVATE_KEY=your_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key
POLYGONSCAN_API_KEY=your_polygonscan_api_key
BASESCAN_API_KEY=your_basescan_api_key
ALCHEMY_API_KEY=your_alchemy_api_key
```

---

## 🧪 Testing

### Frontend Tests
```bash
npm run test:frontend
npm run test:frontend -- --watch
npm run test:frontend -- --coverage
```

### Backend Tests
```bash
npm run test:backend
npm run test:backend -- --watch
npm run test:backend -- --coverage
```

### Smart Contract Tests
```bash
npm run test:contracts
npm run test:contracts -- --coverage
```

### All Tests
```bash
npm run test
```

---

## 📊 Code Quality

### Linting
```bash
npm run lint
```

### Formatting
```bash
npm run format
```

### Pre-commit Hooks
Husky is configured to run linting and tests before commits:
```bash
# Automatically runs on git commit
npm run lint
npm run test
```

---

## 🐳 Docker Setup

### Build Docker Image
```bash
docker build -f backend/Dockerfile -t w3b3-backend .
```

### Run Docker Container
```bash
docker run -p 3001:3001 --env-file backend/.env w3b3-backend
```

### Docker Compose (Optional)
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: w3b3
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"

  redis:
    image: redis:7
    ports:
      - "6379:6379"

  backend:
    build:
      context: .
      dockerfile: backend/Dockerfile
    ports:
      - "3001:3001"
    depends_on:
      - postgres
      - redis
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/w3b3
      REDIS_URL: redis://redis:6379
```

---

## 🚀 Deployment

### Frontend Deployment (Vercel)
```bash
# Automatic deployment on push to main
# Or manual:
npm run build:frontend
vercel deploy --prod
```

### Backend Deployment (Railway/Render)
```bash
# Push to main branch triggers automatic deployment
# Or manual:
npm run build:backend
# Deploy to your hosting platform
```

### Smart Contract Deployment
```bash
# Deploy to Ethereum Sepolia
npm run deploy:contracts -- --network sepolia

# Deploy to Polygon Mumbai
npm run deploy:contracts -- --network mumbai

# Deploy to Base Sepolia
npm run deploy:contracts -- --network baseSepolia
```

---

## 📚 Documentation

- [API Documentation](./docs/API.md)
- [Architecture Guide](./docs/ARCHITECTURE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Security Guide](./docs/SECURITY.md)
- [Sprint Plan](./SPRINT_PLAN.md)
- [Tech Stack](./TECH_STACK.md)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

---

## 📝 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

---

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Database Connection Error
```bash
# Check PostgreSQL is running
psql -U postgres

# Reset database
cd backend
npx prisma migrate reset
```

### Redis Connection Error
```bash
# Check Redis is running
redis-cli ping

# Start Redis
redis-server
```

### Node Modules Issues
```bash
# Clean install
npm run clean
npm install
```

---

## 📞 Support

- GitHub Issues: [Report bugs](https://github.com/yourusername/w3b3/issues)
- Discussions: [Ask questions](https://github.com/yourusername/w3b3/discussions)
- Email: support@w3b3.io

