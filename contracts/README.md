# W3B3 Smart Contracts

Solidity 0.8.x + Hardhat + OpenZeppelin

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm 10+

### Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Compile contracts
npm run compile

# Run tests
npm run test
```

## 📁 Project Structure

```
contracts/
├── StakingPool.sol           # Core staking contract
├── RewardDistribution.sol    # Reward distribution
└── interfaces/
    └── IStakingPool.sol      # Contract interface

scripts/
├── deploy.js                 # Deployment script
└── verify.js                 # Verification script

test/
├── StakingPool.test.js       # Staking tests
└── RewardDistribution.test.js # Reward tests
```

## 🛠️ Available Commands

```bash
npm run compile              # Compile contracts
npm run test                 # Run all tests
npm run test:coverage        # Generate coverage report
npm run gas-report           # Generate gas report
npm run deploy:sepolia       # Deploy to Sepolia testnet
npm run deploy:mumbai        # Deploy to Mumbai testnet
npm run deploy:base-sepolia  # Deploy to Base Sepolia testnet
npm run deploy:mainnet       # Deploy to Ethereum mainnet
npm run verify               # Verify contracts on Etherscan
npm run clean                # Clean build artifacts
npm run node                 # Start local Hardhat node
npm run lint                 # Lint Solidity code
npm run format               # Format Solidity code
```

## 📦 Smart Contracts

### StakingPool.sol
Core staking contract with:
- Stake/Unstake functionality
- Reward calculation
- Claim rewards
- ReentrancyGuard protection
- Access control

### RewardDistribution.sol
Automated reward distribution with:
- Reward rate management
- Automated distribution
- Event logging

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run specific test file
npm run test test/StakingPool.test.js

# Generate coverage report
npm run test:coverage

# Run with gas report
npm run gas-report
```

## 🔐 Security

- ✅ ReentrancyGuard on all transfers
- ✅ OpenZeppelin Ownable for access control
- ✅ SafeERC20 for token interactions
- ✅ Input validation
- ✅ Event logging

## 🚀 Deployment

### Testnet Deployment

```bash
# Sepolia (Ethereum testnet)
npm run deploy:sepolia

# Mumbai (Polygon testnet)
npm run deploy:mumbai

# Base Sepolia (Base testnet)
npm run deploy:base-sepolia
```

### Mainnet Deployment

```bash
# Ethereum mainnet
npm run deploy:mainnet
```

### Verification

```bash
npm run verify -- --network sepolia --address 0x... --constructorArgs args.js
```

## 📝 Environment Variables

Create `.env` file:

```bash
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
POLYGONSCAN_API_KEY=your_polygonscan_api_key
BASESCAN_API_KEY=your_basescan_api_key
ALCHEMY_API_KEY=your_alchemy_api_key
```

## 📚 Documentation

- [Solidity Docs](https://docs.soliditylang.org)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Hardhat Docs](https://hardhat.org/docs)
- [Ethers.js Docs](https://docs.ethers.org)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details
