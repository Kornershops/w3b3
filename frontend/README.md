# W3B3 Frontend

Next.js 14 -> React 18 -> TypeScript -> Tailwind CSS -> RainbowKit v2.

## Environment Configuration

Create .env.local to connect with the backend and RPC providers:

NEXT_PUBLIC_API_URL -> Backend Endpoint -> http://localhost:3001.
NEXT_PUBLIC_WC_PROJECT_ID -> WalletConnect ID -> obtain from cloud.walletconnect.com.
NEXT_PUBLIC_ALCHEMY_API_KEY -> Alchemy Key -> obtain from alchemy.com.

## Available Commands

npm run dev -> Launch local development server on port 3000.
npm run build -> Compile production-ready Next.js bundle.
npm run test -> Execute Vitest component and logic tests.
npm run lint -> Run ESLint and Prettier quality checks.

## Architecture

/src/app -> Router -> Next.js app router and page definitions.
/src/components -> UI -> Reusable React components and design system.
/src/stores -> State -> Zustand global state for user and pools.
/src/services -> Logic -> API abstraction and Web3 contract calls.
/src/types -> Safety -> Unified TypeScript definitions.

---

Historical records are detailed in [CHANGELOG.md](../docs/CHANGELOG.md).
