# W3B3 Frontend

Next.js 14 + React 18 + TypeScript + Tailwind CSS + Web3 Integration

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm 10+

### Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Access
- Frontend: http://localhost:3000

## 📁 Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # Reusable React components
├── hooks/            # Custom React hooks
├── stores/           # Zustand state management
├── services/         # API and Web3 services
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## 🛠️ Available Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run test         # Run tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Generate coverage report
npm run type-check   # Check TypeScript types
npm run clean        # Clean build artifacts
```

## 📦 Dependencies

### Core
- **Next.js 14** - React framework
- **React 18** - UI library
- **TypeScript** - Type safety

### Styling
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Component library
- **Framer Motion** - Animations

### Web3
- **ethers.js** - Ethereum library
- **wagmi** - React hooks for Web3
- **RainbowKit** - Wallet connection UI

### State Management
- **Zustand** - Lightweight state management
- **React Query** - Server state management

### Data Visualization
- **Recharts** - React charts library

### Utilities
- **axios** - HTTP client
- **date-fns** - Date utilities
- **zod** - Schema validation
- **react-hook-form** - Form state management

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Generate coverage report
npm run test:coverage
```

## 📝 Code Style

- **Linting:** ESLint with Next.js config
- **Formatting:** Prettier
- **Type Checking:** TypeScript strict mode

```bash
npm run lint      # Check code style
npm run format    # Auto-format code
npm run type-check # Check types
```

## 🔐 Environment Variables

Create `.env.local` file:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WC_PROJECT_ID=your_walletconnect_id
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```bash
# Build image
docker build -t w3b3-frontend .

# Run container
docker run -p 3000:3000 w3b3-frontend
```

## 📚 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [wagmi Docs](https://wagmi.sh)
- [ethers.js Docs](https://docs.ethers.org)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details
