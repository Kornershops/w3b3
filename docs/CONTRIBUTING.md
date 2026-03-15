# Contributing to W3B3

Thank you for your interest in contributing to W3B3! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## Getting Started

### 1. Fork the Repository
```bash
git clone https://github.com/yourusername/w3b3.git
cd w3b3
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

Use descriptive branch names:
- `feature/add-memecoin-support`
- `fix/wallet-connection-issue`
- `docs/update-api-documentation`
- `refactor/optimize-database-queries`

### 3. Make Your Changes

Follow the coding standards for your workspace:

#### Frontend (Next.js/React)
- Use TypeScript for type safety
- Follow React hooks best practices
- Use Tailwind CSS for styling
- Keep components small and focused
- Write meaningful component names

#### Backend (Express.js)
- Use TypeScript for type safety
- Follow REST API conventions
- Add proper error handling
- Write unit tests for new features
- Document API endpoints

#### Smart Contracts (Solidity)
- Follow Solidity style guide
- Use OpenZeppelin contracts
- Add ReentrancyGuard for security
- Write comprehensive tests
- Add inline comments for complex logic

### 4. Commit Your Changes

Use conventional commits:

```bash
git commit -m "feat: add memecoin staking support"
git commit -m "fix: resolve wallet connection timeout"
git commit -m "docs: update API documentation"
git commit -m "refactor: optimize database queries"
git commit -m "test: add unit tests for stake function"
```

Commit message format:
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, etc.

### 5. Push to Your Fork
```bash
git push origin feature/your-feature-name
```

### 6. Create a Pull Request

- Provide a clear title and description
- Reference related issues
- Include screenshots for UI changes
- Explain the motivation and context
- List any breaking changes

## Development Workflow

### Setup Development Environment

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
cp contracts/.env.example contracts/.env

# Setup database
cd backend
npx prisma migrate dev
cd ..

# Start development servers
npm run dev
```

### Running Tests

```bash
# Run all tests
npm run test

# Run tests for specific workspace
npm run test:frontend
npm run test:backend
npm run test:contracts

# Run tests in watch mode
npm run test -- --watch

# Generate coverage report
npm run test:coverage
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

## Pull Request Process

1. **Update Documentation**
   - Update README.md if needed
   - Update API documentation for backend changes
   - Add comments for complex code

2. **Add Tests**
   - Write tests for new features
   - Ensure existing tests pass
   - Aim for >80% code coverage

3. **Run Quality Checks**
   ```bash
   npm run lint
   npm run format
   npm run type-check
   npm run test
   ```

4. **Create Pull Request**
   - Use the PR template
   - Link related issues
   - Provide clear description
   - Request reviewers

5. **Address Feedback**
   - Respond to comments
   - Make requested changes
   - Push updates to the same branch

6. **Merge**
   - Ensure all checks pass
   - Get approval from maintainers
   - Squash commits if needed
   - Delete feature branch

## Coding Standards

### TypeScript
- Use strict mode
- Avoid `any` type
- Use meaningful variable names
- Add JSDoc comments for functions

```typescript
/**
 * Calculate total rewards for a stake
 * @param stakeAmount - Amount staked in wei
 * @param apyPercentage - Annual percentage yield
 * @param days - Number of days staked
 * @returns Total rewards earned
 */
function calculateRewards(
  stakeAmount: bigint,
  apyPercentage: number,
  days: number
): bigint {
  // Implementation
}
```

### React Components
- Use functional components with hooks
- Keep components focused and reusable
- Use TypeScript for props
- Add PropTypes or TypeScript interfaces

```typescript
interface PoolCardProps {
  poolId: string;
  name: string;
  apy: number;
  tvl: bigint;
  onStake: (poolId: string) => void;
}

export function PoolCard({
  poolId,
  name,
  apy,
  tvl,
  onStake,
}: PoolCardProps) {
  return (
    // JSX
  );
}
```

### Solidity
- Follow Solidity style guide
- Use meaningful variable names
- Add NatSpec comments
- Use events for logging

```solidity
/**
 * @notice Stake tokens in the pool
 * @param amount The amount of tokens to stake
 * @dev Emits Staked event on success
 */
function stake(uint256 amount) external nonReentrant {
  // Implementation
  emit Staked(msg.sender, amount);
}
```

## Testing Guidelines

### Unit Tests
- Test individual functions
- Cover happy path and edge cases
- Use descriptive test names

```typescript
describe('calculateRewards', () => {
  it('should calculate rewards correctly', () => {
    const result = calculateRewards(1000n, 12.5, 365);
    expect(result).toBe(125n);
  });

  it('should handle zero amount', () => {
    const result = calculateRewards(0n, 12.5, 365);
    expect(result).toBe(0n);
  });
});
```

### Integration Tests
- Test multiple components together
- Test API endpoints
- Test database interactions

### Smart Contract Tests
- Test all functions
- Test edge cases and overflow
- Test access control
- Test events

## Documentation

### Code Comments
- Explain why, not what
- Use clear, concise language
- Update comments when code changes

### README Files
- Keep updated with latest changes
- Include setup instructions
- Document available commands
- Add examples

### API Documentation
- Document all endpoints
- Include request/response examples
- Document error codes
- Add authentication requirements

## Issues and Discussions

### Reporting Bugs
1. Check if issue already exists
2. Provide clear description
3. Include steps to reproduce
4. Add screenshots/logs if applicable
5. Specify environment (OS, Node version, etc.)

### Suggesting Features
1. Check if feature already suggested
2. Provide clear use case
3. Explain benefits
4. Discuss implementation approach

### Asking Questions
- Use GitHub Discussions
- Search existing discussions first
- Provide context and details
- Be respectful and patient

## Review Process

### What Reviewers Look For
- Code quality and style
- Test coverage
- Documentation
- Performance implications
- Security concerns
- Breaking changes

### Responding to Reviews
- Thank reviewers for feedback
- Ask for clarification if needed
- Make requested changes
- Push updates to same branch
- Re-request review after changes

## Merge Conflicts

If your branch has conflicts:

```bash
# Update your branch
git fetch origin
git rebase origin/develop

# Resolve conflicts in your editor
# Then continue rebase
git rebase --continue

# Force push to your fork
git push origin feature/your-feature-name --force
```

## Release Process

1. Update version in package.json
2. Update CHANGELOG.md
3. Create release branch
4. Create pull request
5. Get approval
6. Merge to main
7. Create GitHub release
8. Deploy to production

## Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev)
- [Solidity Documentation](https://docs.soliditylang.org)

## Questions?

- Check existing issues and discussions
- Ask in GitHub Discussions
- Email: hello@w3b3.io
- Join our Discord community

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to W3B3! 🙏
