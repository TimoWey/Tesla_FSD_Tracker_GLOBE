#!/bin/bash

# Tesla FSD Tracker Globe - Setup Script
# This script helps set up the development environment

echo "🚀 Setting up Tesla FSD Tracker Globe..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ is required. Current version: $(node -v)"
    echo "   Please update Node.js and try again."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "🔧 Creating .env file..."
    cat > .env << EOF
# Google Sheets API Configuration
# Replace these values with your actual configuration
REACT_APP_GOOGLE_SHEETS_API_KEY=your_api_key_here
REACT_APP_SPREADSHEET_ID=your_spreadsheet_id_here
REACT_APP_SHEET_NAME=Sheet1

# Optional: Custom configuration
REACT_APP_APP_NAME=Tesla FSD Tracker
REACT_APP_VERSION=1.0.0
EOF
    echo "✅ .env file created"
    echo "⚠️  Please update .env with your Google Sheets API credentials"
else
    echo "✅ .env file already exists"
fi

# Create .env.example file
echo "📝 Creating .env.example file..."
cat > .env.example << EOF
# Google Sheets API Configuration
REACT_APP_GOOGLE_SHEETS_API_KEY=your_api_key_here
REACT_APP_SPREADSHEET_ID=your_spreadsheet_id_here
REACT_APP_SHEET_NAME=Sheet1

# Optional: Custom configuration
REACT_APP_APP_NAME=Tesla FSD Tracker
REACT_APP_VERSION=1.0.0
EOF

echo "✅ .env.example file created"

# Check if Tailwind CSS is properly configured
if [ ! -f tailwind.config.js ]; then
    echo "❌ Tailwind CSS configuration not found"
    exit 1
fi

if [ ! -f postcss.config.js ]; then
    echo "❌ PostCSS configuration not found"
    exit 1
fi

echo "✅ Tailwind CSS configuration verified"

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Update .env with your Google Sheets API credentials"
echo "2. Run 'npm start' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "For more information, see README.md"
echo ""
echo "Happy coding! 🚗⚡"
