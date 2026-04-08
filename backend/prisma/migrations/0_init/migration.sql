-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "chainId" INTEGER,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "referralCode" TEXT NOT NULL,
    "referredById" TEXT,
    "points" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staking_pools" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "chainId" INTEGER NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "tokenSymbol" TEXT NOT NULL,
    "tokenDecimals" INTEGER NOT NULL,
    "apyPercentage" DECIMAL(5,2) NOT NULL,
    "tvlAmount" DECIMAL(30,8) NOT NULL,
    "minimumStake" DECIMAL(20,8) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staking_pools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_stakes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "poolId" TEXT NOT NULL,
    "amountStaked" DECIMAL(20,8) NOT NULL,
    "rewardsClaimed" DECIMAL(20,8) NOT NULL DEFAULT 0,
    "transactionHash" TEXT,
    "stakedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unstakedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_stakes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rewards" (
    "id" TEXT NOT NULL,
    "stakeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DECIMAL(20,8) NOT NULL,
    "claimedAt" TIMESTAMP(3),
    "transactionHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rewards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_walletAddress_key" ON "users"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "users_referralCode_key" ON "users"("referralCode");

-- CreateIndex
CREATE INDEX "staking_pools_chainId_idx" ON "staking_pools"("chainId");

-- CreateIndex
CREATE UNIQUE INDEX "staking_pools_chainId_contractAddress_key" ON "staking_pools"("chainId", "contractAddress");

-- CreateIndex
CREATE INDEX "user_stakes_userId_idx" ON "user_stakes"("userId");

-- CreateIndex
CREATE INDEX "user_stakes_poolId_idx" ON "user_stakes"("poolId");

-- CreateIndex
CREATE INDEX "rewards_stakeId_idx" ON "rewards"("stakeId");

-- CreateIndex
CREATE INDEX "rewards_userId_idx" ON "rewards"("userId");

-- AddForeignKey
ALTER TABLE "user_stakes" ADD CONSTRAINT "user_stakes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_stakes" ADD CONSTRAINT "user_stakes_poolId_fkey" FOREIGN KEY ("poolId") REFERENCES "staking_pools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rewards" ADD CONSTRAINT "rewards_stakeId_fkey" FOREIGN KEY ("stakeId") REFERENCES "user_stakes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rewards" ADD CONSTRAINT "rewards_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

