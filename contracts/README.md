# W3B3 Smart Contracts

Solidity 0.8.24 -> Hardhat -> OpenZeppelin -> Cancun EVM.

## Environment Configuration

Create .env with the following variables for deployment and verification:

PRIVATE_KEY -> Deployer Key -> Required for all networks.
ALCHEMY_API_KEY -> RPC Key -> Required for deployment.
ETHERSCAN_API_KEY -> Verify Key -> Ethereum.
POLYGONSCAN_API_KEY -> Verify Key -> Polygon.
BASESCAN_API_KEY -> Verify Key -> Base.

## Available Commands

npm run compile -> Compile Solidity contracts using Hardhat.
npm run test -> Execute contract test suite via Mocha/Chai.
npm run deploy -> Deploy contracts to the configured network.
npm run verify -> Synchronize source code with block explorers.

## Contract Architecture

StakingPool.sol -> Logic -> Core staking, rewards, and exit logic.
StakingPoolFactory.sol -> Factory -> Autonomous pool deployment system.
W3B3Token.sol -> Token -> Governance token with ERC20Permit.

## Security Features

Access Control -> OpenZeppelin Ownable for administrative actions.
ReentrancyGuard -> Atomic protection against recursive call attacks.
Pausable -> Emergency circuit breaker for all pool logic.

---

Historical records are detailed in [CHANGELOG.md](../docs/CHANGELOG.md).
