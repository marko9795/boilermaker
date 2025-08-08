#!/bin/bash

# Development setup script for Boilermaker Toolbox

echo "🔧 Setting up Boilermaker Toolbox development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run initial checks
echo "🧪 Running initial quality checks..."
npm run lint
npm run format:check
npm run test

echo "🎉 Development environment setup complete!"
echo ""
echo "To start development:"
echo "  npm run dev"
echo ""
echo "Other useful commands:"
echo "  npm run test:watch    # Run tests in watch mode"
echo "  npm run lint:fix      # Fix linting issues"
echo "  npm run format        # Format code"
echo "  npm run build         # Build for production"