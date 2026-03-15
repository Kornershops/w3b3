# W3B3 Tech Stack & Dependencies

**Version:** 1.0  
**Last Updated:** March 2026  
**Focus:** Open-Source & Production-Ready

---

## 📋 Table of Contents

1. [Frontend Stack](#frontend-stack)
2. [Backend Stack](#backend-stack)
3. [Smart Contracts](#smart-contracts)
4. [Infrastructure & DevOps](#infrastructure--devops)
5. [APIs & Services](#apis--services)
6. [Development Tools](#development-tools)
7. [Monitoring & Analytics](#monitoring--analytics)
8. [Installation Guide](#installation-guide)

---

## 🎨 Frontend Stack

### Core Framework
| Package | Version | Purpose | License |
|---------|---------|---------|---------|
| `next` | ^14.0.0 | React framework with SSR | MIT |
| `react` | ^18.2.0 | UI library | MIT |
| `react-dom` | ^18.2.0 | React DOM rendering | MIT |
| `typescript` | ^5.3.0 | Type safety | Apache 2.0 |

### Styling & UI
| Package | Version | Purpose | License |
|---------|---------|---------|---------|
| `tailwindcss` | ^3.3.0 | Utility-first CSS | MIT |
| `postcss` | ^8.4.0 | CSS processing | MIT |
| `autoprefixer` | ^10.4.0 | CSS vendor prefixes | MIT |
| `shadcn/ui` | latest | Component library | MIT |
| `@radix-ui/react-*` | latest | Headless UI components | MIT |
| `class-variance-authority` | ^0.7.0 | Component variants | Apache 2.0 |
| `clsx` | ^2.0.0 | Conditional classnames | MIT |

### Web3 Integration
| Package | Version | Purpose | License |
|---------|---------|---------|---------|
| `ethers` | ^6.11.0 | Ethereum library | MIT |
| `wagmi` | ^1.4.0 | React hooks for Web3 | MIT |
| `@rainbow-me/rainbowkit` | ^0.12.0 | Wallet connection UI | MIT |
| `viem` | ^1.0.0 | TypeScript Ethereum library | MIT |
| `web3-react` | ^8.0.0 | Web3 provider | MIT |

### State Management
| Package | Version | Purpose | License |
|---------|---------|---------|---------|
| `zustand` | ^4.4.0 | Lightweight state management | MIT |
| `@tanstack/react-query` | ^5.28.0 | Server state management | MIT |
| `jotai` | ^2.4.0 | Primitive state management | MIT |

### Data Visualization
| Package | Version | Purpose | License |
|---------|---------|---------|---------|
| `recharts` | ^2.10.0 | React charts library | MIT |
| `chart.js` | ^4.4.0 | Chart library | MIT |
| `react-chartjs-2` | ^5.2.0 | React wrapper for Chart.js | MIT |

### Animations & Effects
| Package | Version | Purpose | License |
|---------|---------|---------|---------|
| `framer-motion` | ^10.16.0 | Animation library | MIT |
| `react-spring` | ^9.7.0 | Spring physics animations | MIT |

### Real-time Communication
| Package | Version | Purpose | License |
|---------|---------|---------|---------|
| `socket.io-client` | ^4.7.0 | WebSocket client | MIT |

### Utilities
| Package | Version | Purpose | License |
|---------|---------|---------|---------|
| `axios` | ^1.6.0 | HTTP client | MIT |
| `date-fns` | ^2.30.0 | Date utilities | MIT |
| `lodash-es` | ^4.17.0 | Utility functions | MIT |
| `zod` | ^3.22.0 | Schema validation | MIT |
| `react-hook-form` | ^7.48.0 | Form state management | MIT |

### Development Dependencies
| Package | Version | Purpose | License |
|---------|---------|---------|---------|
| `@types/react` | ^18.2.0 | React types | MIT |
| `@types/react-dom` | ^18.2.0 | React DOM types | MIT |
| `@types/node` | ^20.0.0 | Node types | MIT |
| `eslint` | ^8.50.0 | Code linting | MIT |
| `eslint-config-next` | ^14.0.0 | Next.js ESLint config | MIT |
| `prettier` | ^3.0.0 | Code formatting | MIT |
| `@testing-library/react` | ^14.0.0 | React testing | MIT |
| `@testing-library/jest-dom` | ^6.1.0 | Jest matchers | MIT |
| `vitest` | ^0.34.0 | Unit testing | MIT |

### Frontend package.json
```json
{
  "name": "w3b3-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest",
    "test:ui": "vitest --ui"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "^14.0.0",
    "typescript": "^5.3.0",
    "tailwindcss": "^3.3.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "shadcn/ui": "latest",
    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-dropdown-menu": "^2.0.0",
    "@radix-ui/react-slot": "^2.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "ethers": "^6.11.0",
    "wagmi": "^1.4.0",
    "@rainbow-me/rainbowkit": "^0.12.0",
    "viem": "^1.0.0",
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^5.28.0",
    "recharts": "^2.10.0",
    "framer-motion": "^10.16.0",
    "socket.io-client": "^4.7.0",
    "axios": "^1.6.0",
    "date-fns": "^2.30.0",
    "lodash-es": "^4.17.0",
    "zod": "^3.22.0",
    "react-hook-form": "^7.48.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/node": "^20.0.0",
    "eslint": "^8.50.0",
    "eslint-config-next": "^14.0.0",
    "prettier": "^3.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "vitest": "^0.34.0"
  }
}
```

---

## 🔧 Backend Stack

### Core Framework
| Package | Version | Purpose | License |
|---------|---------|---------|---------|
| `express` | ^4.18.0 | Web framework | MIT |
| `typescript` | ^5.3.0 | Type safety | Apache 2.0 |
| `ts-node` | ^10.9.0 | TypeScript execution | MIT |

### Database & ORM
| Package | Version | Purpose | License |
|---------|---------|---------|---------|
| `prisma` | ^5.7.0 | ORM | Apache 2.0 |
| `@prisma/client` | ^5.7.0 | Prisma client | Apache 2.0 |
| `pg` | ^8.11.0 | PostgreSQL driver | MIT |

### Caching
| Package | Version | Purpose | License |
|---------|---------|---------|---------|
| `redis` | ^4.6.0 | Redis client | MIT |
| `ioredis` | ^5.3.0 | Redis client (alternative) | MIT |

### Web3 & Blockchain
| Package | Version | Purpose | License |
|---------|---------|---------|---------|
| `ethers` | ^6.11.0 | Ethereum library | MIT |
| `alchemy-sdk` | ^3.0.0 | Alchemy API SDK | MIT |
| `web3` | ^1.10.0 | Web3.js library | LGPL-3.0 |

### Authentication & Security
| Package | Version | Purpose | License |
|---------|---------|---------|---------|
| `jsonwebtoken` | ^9.1.0 | JWT tokens | MIT |
| `passport` | ^0.7.0 | Authentication middleware | MIT |
| `passport-jwt` | ^4.0.0 | JWT strategy | MIT |
| `bcryptjs` | ^2.4.0 | Password hashing | MIT |
| `helmet` | ^7.1.0 | Security headers | MIT |
| `cors` | ^2.8.5 | CORS middleware | MIT |
| `express-rate-limit` | ^7.1.0 | Rate limiting | MIT |

### Real-time Communication
| Package | Version | Purpose | License |
|---------|---------|---------|---------|
| `socket.io` | ^4.7.0 | WebSocket server | MIT |

### Validation & Parsing
| Package | Version | Purpose | License |
|---------|---------|---------|---------|
| `zod` | ^3.22.0 | Schema validation | MIT |
| `joi` | ^17.11.0 | Data validation | BSD-3-Clause |

### Utilities
| Package | Version | Purpose | License |
|---------|---------|---------|---------|
| `dotenv` | ^16.3.0 | Environment variables | BSD-2-Clause |
| `axios` | ^1.6.0 | HTTP client | MIT |
| `date-fns` | ^2.30.0 | Date utilities | MIT |
| `lodash` | ^4.17.0 | Utility functions | MIT |
| `uuid` | ^9.0.0 | UUID generation | MIT |

### Logging & Monitoring
| Package | Version | Purpose | License |
|---------|---------|---------|---------|
| `winston` | ^3.11.0 | Logging library | MIT |
| `morgan` | ^1.10.0 | HTTP request logger | MIT |

### Development Dependencies
| Package | Version | Purpose | License |
|---------|---------|---------|---------|
| `@types/express` | ^4.17.0 | Express types | MIT |
| `@types/node` | ^20.0.0 | Node types | MIT |
| `@types/cors` | ^2.8.0 | CORS types | MIT |
| `jest` | ^29.7.0 | Testing framework | MIT |
| `@types/jest` | ^29.5.0 | Jest types | MIT |
| `ts-jest` | ^29.1.0 | Jest TypeScript support | MIT |
| `supertest` | ^6.3.0 | HTTP testing | MIT |
| `eslint` | ^8.50.0 | Code linting | MIT |
| `prettier` | ^3.0.0 | Code formatting | MIT |

### Backend package.json
```json
{
  "name": "w3b3-backend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src",
    "format": "prettier --write src"
  },
  "dependencies": {
    "express": "^4.18.0",
    "typescript": "^5.3.0",
    "ts-node": "^10.9.0",
    "prisma": "^5.7.0",
    "@prisma/client": "^5.7.0",
    "pg": "^8.11.0",
    "redis": "^4.6.0",
    "ethers": "^6.11.0",
    "alchemy-sdk": "^3.0.0",
    "jsonwebtoken": "^9.1.0",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.0",
    "bcryptjs": "^2.4.0",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "express-rate-limit": "^7.1.0",
    "socket.io": "^4.7.0",
    "zod": "^3.22.0",
    "dotenv": "^16.3.0",
    "axios": "^1.6.0",
    "date-fns": "^2.30.0",
    "lodash": "^4.17.0",
    "uuid": "^9.0.0",
    "winston": "^3.11.0",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.0",
    "@types/node": "^20.0.0",
    "@types/cors": "^2.8.0",
    "@types/jest": "^29.5.0",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.0",
    "supertest": "^6.3.0",
    "eslint": "^8.50.0",
    "prettier": "^3.0.0"
  }
}
```

---

## 🔐 Smart Contracts

### Development Framework
| Package | Version | Purpose | License |
|---------|---------|---------|---------|
| `hardhat` | ^2.19.0 | Development environment | MIT |
| `@nomicfoundation/hardhat-toolbox` | ^3.0.0 | Hardhat plugins | MIT |
| `solidity` | ^0.8.20 | Smart contract language | GPL-3.0 |

### Security & Testing
| Package | Version | Purpose | License |
|---------|---------|---------|---------|
| `@openzeppelin/contracts` | ^5.0.0 | Secure contract library | MIT |
| `chai` | ^4.3.0 | Testing framework | MIT |
| `ethers` | ^6.11.0 | Ethereum library | MIT |

### Deployment & Verification
| Package | Version | Purpose | License |
|---------|---------|---------|---------|
| `hardhat-etherscan` | ^3.1.0 | Contract verification | MIT |
| `hardhat-gas-reporter` | ^1.0.0 | Gas usage reporting | MIT |
| `solidity-coverage` | ^0.8.0 | Coverage reporting | MIT |

### Development Dependencies
| Package | Version | Purpose | License |
|---------|---------|---------|---------|
| `@types/node` | ^20.0.0 | Node types | MIT |
| `dotenv` | ^16.3.0 | Environment variables | BSD-2-Clause |

### Smart Contracts package.json
```json
{
  "name": "w3b3-contracts",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "compile": "hardhat compile",
    "test": "hardhat test",
    "test:coverage": "hardhat coverage",
    "deploy:sepolia": "hardhat run scripts/deploy.js --network sepolia",
    "deploy:mumbai": "hardhat run scripts/deploy.js --network mumbai",
    "deploy:base-sepolia": "hardhat run scripts/deploy.js --network baseSepolia",
    "verify": "hardhat verify"
  },
  "devDependencies": {
    "hardhat": "^2.19.0",
    "@nomicfoundation/hardhat-toolbox": "^3.0.0",
    "@openzeppelin/contracts": "^5.0.0",
    "chai": "^4.3.0",
    "ethers": "^6.11.0",
    "hardhat-etherscan": "^3.1.0",
    "hardhat-gas-reporter": "^1.0.0",
    "solidity-coverage": "^0.8.0",
    "@types/node": "^20.0.0",
    "dotenv": "^16.3.0"
  }
}
```

---

## 🏗️ Infrastructure & DevOps

### Hosting & Deployment
| Service | Purpose | Tier | Cost |
|---------|---------|------|------|
| **Vercel** | Frontend hosting | Pro | $20/mo |
| **Railway** | Backend hosting | Hobby | $5/mo |
| **AWS RDS** | PostgreSQL database | db.t3.micro | $15/mo |
| **Redis Cloud** | Redis caching | 30MB free | Free |
| **GitHub** | Version control | Free | Free |

### CI/CD
| Tool | Purpose | License |
|------|---------|---------|
| **GitHub Actions** | CI/CD pipeline | Free |
| **Docker** | Containerization | Open Source |

### Monitoring & Logging
| Service | Purpose | Tier | Cost |
|---------|---------|------|------|
| **Sentry** | Error tracking | Free | Free |
| **LogRocket** | Frontend monitoring | Free | Free |
| **Uptime Robot** | Uptime monitoring | Free | Free |

### Docker Configuration
```dockerfile
# Backend Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001
CMD ["npm", "start"]
```

### GitHub Actions Workflow
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run build
      - run: npm run deploy
```

---

## 🔌 APIs & Services

### Blockchain RPC Providers
| Service | Purpose | Free Tier | Paid Tier |
|---------|---------|-----------|-----------|
| **Alchemy** | Multi-chain RPC | 300M compute units/mo | $50-200/mo |
| **Infura** | Ethereum RPC | 100K requests/day | $50+/mo |
| **QuickNode** | Multi-chain RPC | 250M requests/mo | $50+/mo |
| **Ankr** | Multi-chain RPC | 2M requests/day | $50+/mo |

### Blockchain Data & Indexing
| Service | Purpose | Free Tier | Paid Tier |
|---------|---------|-----------|-----------|
| **The Graph** | Subgraph indexing | Free | $0.10+/query |
| **Dune Analytics** | On-chain analytics | Free | $300+/mo |
| **Etherscan API** | Ethereum data | Free | $500+/mo |
| **Alchemy Notify** | Event webhooks | Free | Included |

### Price Feeds & Oracles
| Service | Purpose | License |
|---------|---------|---------|
| **Chainlink** | Decentralized oracles | Open Source |
| **Pyth Network** | Price feeds | Open Source |
| **CoinGecko API** | Price data | Free |
| **CoinMarketCap API** | Price data | Free tier |

### Recommended API Stack
```javascript
// Alchemy SDK for RPC calls
import { Alchemy, Network } from "alchemy-sdk";

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

// The Graph for indexing
const query = `
  query {
    stakingPools(first: 10) {
      id
      totalStaked
      apy
    }
  }
`;

// CoinGecko for prices (free)
const prices = await fetch(
  'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,polygon&vs_currencies=usd'
);
```

---

## 🛠️ Development Tools

### Code Quality
| Tool | Purpose | License |
|------|---------|---------|
| **ESLint** | Code linting | MIT |
| **Prettier** | Code formatting | MIT |
| **SonarQube** | Code analysis | AGPL-3.0 |
| **Husky** | Git hooks | MIT |

### Testing
| Tool | Purpose | License |
|------|---------|---------|
| **Jest** | Unit testing | MIT |
| **Vitest** | Fast unit testing | MIT |
| **React Testing Library** | Component testing | MIT |
| **Cypress** | E2E testing | MIT |
| **Hardhat** | Contract testing | MIT |

### Version Control
| Tool | Purpose | License |
|------|---------|---------|
| **Git** | Version control | GPL-2.0 |
| **GitHub** | Repository hosting | Proprietary |
| **Conventional Commits** | Commit standards | CC0-1.0 |

### Documentation
| Tool | Purpose | License |
|------|---------|---------|
| **Swagger/OpenAPI** | API documentation | Apache 2.0 |
| **Markdown** | Documentation format | Open |
| **Docusaurus** | Documentation site | MIT |

### Development Setup
```bash
# Install Husky for git hooks
npm install husky --save-dev
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm run test"

# Setup Prettier
npm install prettier --save-dev
echo '{}' > .prettierrc

# Setup ESLint
npm install eslint --save-dev
npx eslint --init
```

---

## 📊 Monitoring & Analytics

### Error Tracking
| Service | Purpose | Free Tier | Paid Tier |
|---------|---------|-----------|-----------|
| **Sentry** | Error tracking | 5K events/mo | $29+/mo |
| **Rollbar** | Error monitoring | Free | $49+/mo |
| **Bugsnag** | Error reporting | Free | $99+/mo |

### Frontend Monitoring
| Service | Purpose | Free Tier | Paid Tier |
|---------|---------|-----------|-----------|
| **LogRocket** | Session replay | Free | $99+/mo |
| **Datadog** | Full monitoring | Free trial | $15+/mo |
| **New Relic** | APM | Free | $99+/mo |

### Analytics
| Service | Purpose | Free Tier | Paid Tier |
|---------|---------|-----------|-----------|
| **Mixpanel** | Product analytics | Free | $999+/mo |
| **Amplitude** | Analytics | Free | $995+/mo |
| **Plausible** | Privacy-first analytics | Free trial | $9+/mo |
| **Dune Analytics** | On-chain analytics | Free | $300+/mo |

### Monitoring Setup
```javascript
// Sentry integration
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// LogRocket integration
import LogRocket from 'logrocket';

LogRocket.init(process.env.LOGROCKET_ID);

// Custom analytics
const trackEvent = (eventName, properties) => {
  // Send to Mixpanel or custom endpoint
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify({ event: eventName, ...properties })
  });
};
```

---

## 📦 Installation Guide

### Prerequisites
```bash
# Node.js 20 LTS
node --version  # v20.x.x

# npm 10+
npm --version   # 10.x.x

# Git
git --version   # 2.x.x

# PostgreSQL 14+
psql --version  # 14.x

# Redis 7+
redis-cli --version  # 7.x
```

### Frontend Setup
```bash
# Create Next.js project
npx create-next-app@latest frontend --typescript

cd frontend

# Install dependencies
npm install

# Install Web3 packages
npm install ethers wagmi @rainbow-me/rainbowkit viem

# Install UI packages
npm install tailwindcss postcss autoprefixer
npm install shadcn-ui

# Install state management
npm install zustand @tanstack/react-query

# Install utilities
npm install axios date-fns zod react-hook-form

# Setup environment
cp .env.example .env.local

# Run development server
npm run dev
```

### Backend Setup
```bash
# Create backend directory
mkdir backend && cd backend

# Initialize Node project
npm init -y

# Install dependencies
npm install express cors helmet dotenv jsonwebtoken passport ethers alchemy-sdk redis socket.io

# Install dev dependencies
npm install -D typescript ts-node @types/express @types/node jest ts-jest

# Install database
npm install prisma @prisma/client pg

# Setup Prisma
npx prisma init

# Setup environment
cp .env.example .env

# Run migrations
npx prisma migrate dev

# Run development server
npm run dev
```

### Smart Contracts Setup
```bash
# Create contracts directory
mkdir contracts && cd contracts

# Initialize Hardhat
npx hardhat init

# Install dependencies
npm install @openzeppelin/contracts

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to testnet
npx hardhat run scripts/deploy.js --network sepolia
```

### Full Project Setup (One Command)
```bash
# Clone repository
git clone https://github.com/yourusername/w3b3.git
cd w3b3

# Install all dependencies
npm install --workspaces

# Setup environment files
cp .env.example .env

# Run all services
npm run dev:all
```

---

## 🔒 Security Best Practices

### Environment Variables
```bash
# .env.example (commit this)
NEXT_PUBLIC_WC_PROJECT_ID=your_walletconnect_id
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key

# .env.local (DO NOT commit)
DATABASE_URL=postgresql://user:password@localhost:5432/w3b3
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secret_key
ALCHEMY_API_KEY=your_alchemy_key
```

### Dependency Security
```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies safely
npm update

# Check outdated packages
npm outdated
```

### Code Security
```bash
# Run ESLint
npm run lint

# Run tests
npm test

# Check test coverage
npm run test:coverage

# Run security audit
npm audit
```

---

## 📈 Performance Optimization

### Frontend Optimization
- Code splitting (automatic with Next.js)
- Image optimization (next/image)
- CSS minification (Tailwind)
- JavaScript minification (Next.js build)
- Lazy loading components
- Caching strategies

### Backend Optimization
- Database indexing
- Redis caching (60s TTL for pools)
- Connection pooling
- Gzip compression
- Rate limiting
- Query optimization

### Smart Contract Optimization
- Gas optimization
- Storage optimization
- Batch operations
- Event logging (vs storage)

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Code coverage > 80%
- [ ] Security audit completed
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] Smart contracts audited

### Deployment
- [ ] Deploy smart contracts
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Verify all endpoints
- [ ] Monitor for errors
- [ ] Collect user feedback

### Post-Deployment
- [ ] Monitor Sentry
- [ ] Monitor API performance
- [ ] Monitor database
- [ ] Monitor user activity
- [ ] Plan Phase 2

---

## 📚 Additional Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Express.js Docs](https://expressjs.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Hardhat Docs](https://hardhat.org/docs)
- [Ethers.js Docs](https://docs.ethers.org/)
- [Wagmi Docs](https://wagmi.sh/)

### Learning Resources
- [Solidity by Example](https://solidity-by-example.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Web3 Security Best Practices](https://ethereum.org/en/developers/docs/smart-contracts/security/)
- [DeFi Protocol Design](https://ethereum.org/en/developers/docs/dapps/)

### Community
- [Ethereum Stack Exchange](https://ethereum.stackexchange.com/)
- [OpenZeppelin Forum](https://forum.openzeppelin.com/)
- [Hardhat Discord](https://discord.gg/hardhat)
- [Ethereum Research](https://ethresear.ch/)

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Mar 2026 | Initial tech stack documentation |

---

## 🤝 Contributing

When adding new dependencies:
1. Check license compatibility
2. Verify security (npm audit)
3. Check bundle size impact
4. Update this document
5. Create PR with justification

---

## 📞 Support

For questions about the tech stack:
- Check documentation links above
- Search GitHub issues
- Ask in community forums
- Create GitHub discussion

