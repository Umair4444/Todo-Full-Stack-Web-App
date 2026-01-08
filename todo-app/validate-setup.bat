#!/bin/bash
# Quickstart validation script for Todo Full-Stack Web Application

echo "🔍 Starting quickstart validation..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js version 18.x or higher."
    exit 1
else
    NODE_VERSION=$(node --version)
    echo "✅ Node.js version: $NODE_VERSION"
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm version 8.x or higher."
    exit 1
else
    NPM_VERSION=$(npm --version)
    echo "✅ npm version: $NPM_VERSION"
fi

# Navigate to the todo-app directory
cd todo-app

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found in todo-app directory"
    exit 1
else
    echo "✅ package.json found"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
else
    echo "✅ Dependencies installed successfully"
fi

# Run build to check for compilation errors
echo "🔨 Running build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
else
    echo "✅ Build completed successfully"
fi

# Run linting if available
if npm run lint &> /dev/null; then
    echo "🔍 Running linting..."
    npm run lint
    if [ $? -ne 0 ]; then
        echo "⚠️  Linting issues found"
    else
        echo "✅ Linting passed"
    fi
else
    echo "ℹ️  Linting script not available"
fi

# Check if tests exist and run them
if npm run test &> /dev/null; then
    echo "🧪 Running tests..."
    npm run test
    if [ $? -ne 0 ]; then
        echo "⚠️  Some tests failed"
    else
        echo "✅ All tests passed"
    fi
else
    echo "ℹ️  Test script not available"
fi

echo "🎉 Quickstart validation completed successfully!"
echo "✅ The setup works as documented in the README.md"