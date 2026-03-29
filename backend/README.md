# W3B3 Backend API

Express.js -> TypeScript -> Prisma -> Postgres -> Redis -> Socket.io.

## Environment Configuration

Create .env with the following essential variables:

DATABASE_URL -> Postgres URI -> Core data persistence.
REDIS_URL -> Redis URI -> Pool/Stake caching layer.
JWT_SECRET -> Access Secret -> JWT access token signing.
JWT_REFRESH_SECRET -> Refresh Secret -> Secure token rotation.
ALCHEMY_API_KEY -> RPC Key -> Blockchain verification calls.

## Available Commands

npm run dev -> Start TypeScript server via ts-node in development mode.
npm run build -> Compile TypeScript to production JavaScript in /dist.
npm run test -> Execute system-wide Jest test suite.
npm run db:migrate -> Synchronize Prisma schema with the database.

## API Architecture

/src/routes -> Routing -> Express route definitions and mounting.
/src/services -> Business Logic -> Service layer for DB and RPC interaction.
/src/middleware -> Security -> Auth, rate limiting, and validation logic.
/src/prisma -> Schema -> Database models and migration history.

---

Historical records are detailed in [CHANGELOG.md](../docs/CHANGELOG.md).
