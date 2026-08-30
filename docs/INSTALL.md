# W3B3 Installation & Setup Guide

Establish your local development environment for the W3B3 Multi-Chain Staking Portal.

## Prerequisites

Node.js → 20+ LTS.
npm → 10+.
PostgreSQL → 14+.
Redis → 7+.

## Quick Start Configuration

### 1. Repository Setup

```bash
git clone https://github.com/Kornershops/w3b3.git
cd w3b3
npm install --force --legacy-peer-deps
```

> [!TIP]
> If you encounter dependency resolution conflicts in the current monorepo environment, use the flags above to bypass legacy overrides and ensure a clean environment.

### 2. Environment Variables

Initialize the environment templates across the monorepo:

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
cp contracts/.env.example contracts/.env
```

### 3. Database Migration

Sync the Prisma schema with your local PostgreSQL instance:

```bash
cd backend
npx prisma db push
cd ..
```

### 4. Application Launch

```bash
npm run dev
```

## Available Commands

| Command | Description |
|---|---|
| `npm run dev` | Start all services |
| `npm run test` | Execute whole-system test suite |
| `npm run dev:frontend` | Start Next.js development server |
| `npm run dev:backend` | Start Express API server |
| `npm run dev:contracts` | Start Hardhat local node |

## Connection Details

Frontend → http://localhost:3000
Backend → http://localhost:3001
Swagger Docs → http://localhost:3001/api-docs

## Branch Notes

- Local `main` runs Next.js `^14.2.0`.
- `origin/phase-14/production-assurance` runs Next.js `^15.5.24` and includes all security hardening. This branch is pending merge after CI blockers are resolved (see [CHANGELOG.md](./CHANGELOG.md)).
- If running the phase-14 branch locally, the `pool/[id]/page.tsx` async params fix must be applied first for `next build` to succeed.

---

Historical records are detailed in [CHANGELOG.md](./CHANGELOG.md).
