#!/bin/bash

# W3B3 Quick Start Script
# This script sets up the W3B3 project for development

echo "🚀 W3B3 Project Setup"
echo "===================="
echo ""

# Check Node.js version
echo "✓ Checking Node.js version..."
node_version=$(node -v)
echo "  Node.js: $node_version"

# Check npm version
echo "✓ Checking npm version..."
npm_version=$(npm -v)
echo "  npm: $npm_version"

# Install dependencies
echo ""
echo "✓ Installing dependencies..."
npm install

# Setup environment files
echo ""
echo "✓ Setting up environment files..."
cp .env.example .env
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
cp contracts/.env.example contracts/.env

echo ""
echo "✓ Environment files created:"
echo "  - .env"
echo "  - frontend/.env.local"
echo "  - backend/.env"
echo "  - contracts/.env"

# Setup database
echo ""
echo "✓ Setting up database..."
cd backend
npx prisma migrate dev --name init
cd ..

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📝 Next Steps:"
echo "1. Edit environment files with your actual values"
echo "2. Start development servers:"
echo "   - npm run dev:frontend (Terminal 1)"
echo "   - npm run dev:backend (Terminal 2)"
echo "   - npm run dev:contracts (Terminal 3 - optional)"
echo ""
echo "🌐 Access:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend: http://localhost:3001"
echo ""
echo "📚 Documentation:"
echo "   - SPRINT_PLAN.md - Development roadmap"
echo "   - TECH_STACK.md - Technology details"
echo "   - README.md - Project overview"
echo ""
echo "Happy coding! 🎉"
