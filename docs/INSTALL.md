# W3B3 Installation & Setup Guide

Establish your local development environment for the W3B3 Multi-Chain Staking Portal.

## Prerequisites

Node.js -> 20+ LTS.
npm -> 10+.
PostgreSQL -> 14+.
Redis -> 7+.

## Quick Start Configuration

### 1. Repository Setup

git clone https://github.com/Kornershops/w3b3.git.
cd w3b3.
npm install --force --legacy-peer-deps

> [!TIP]
> If you encounter dependency resolution conflicts in the current monorepo environment, use the flags above to bypass legacy overrides and ensure a clean environment.

### 2. Environment Variables

Initialize the environment templates across the monorepo:

Root -> cp .env.example .env.
/frontend -> cp .env.example .env.local.
/backend -> cp .env.example .env.
/contracts -> cp .env.example .env.

### 3. Database Migration

Sync the Prisma schema with your local PostgreSQL instance:

cd backend.
npx prisma db push.
cd ...

### 4. Application Launch

npm run dev.

## Available Commands

System -> npm run dev -> Start all services.
Testing -> npm run test -> Execute whole-system test suite.
Frontend -> npm run dev:frontend -> Start Next.js development server.
Backend -> npm run dev:backend -> Start Express API server.
Contracts -> npm run dev:contracts -> Start Hardhat node.

## Connection Details

Frontend -> http://localhost:3000.
Backend -> http://localhost:3001.
Swagger Docs -> http://localhost:3001/api-docs.

---

Historical records are detailed in [CHANGELOG.md](./CHANGELOG.md).
