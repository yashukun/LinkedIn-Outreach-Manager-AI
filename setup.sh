#!/bin/bash

# LinkedIn Outreach Manager - Setup Script
# This script automates the setup process

echo "🚀 LinkedIn Outreach Manager - Setup Script"
echo "==========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Python is installed
echo -e "${BLUE}Checking prerequisites...${NC}"
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed. Please install Python 3.8 or higher.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Python 3 found${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 16 or higher.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js found${NC}"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}⚠️  PostgreSQL is not installed.${NC}"
    echo "Install PostgreSQL:"
    echo "  macOS: brew install postgresql"
    echo "  Ubuntu: sudo apt-get install postgresql"
    read -p "Continue without PostgreSQL? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}✓ PostgreSQL found${NC}"
fi

echo ""
echo -e "${BLUE}Setting up Backend...${NC}"

# Backend setup
cd backend

# Create virtual environment
echo "Creating Python virtual environment..."
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

echo -e "${GREEN}✓ Backend setup complete${NC}"

cd ..

echo ""
echo -e "${BLUE}Setting up Frontend...${NC}"

# Frontend setup
cd frontend

# Install dependencies
echo "Installing Node.js dependencies..."
npm install

echo -e "${GREEN}✓ Frontend setup complete${NC}"

cd ..

echo ""
echo "==========================================="
echo -e "${GREEN}✨ Setup Complete!${NC}"
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Configure PostgreSQL database:"
echo "   createdb linkedin_outreach"
echo ""
echo "2. Update database connection in backend/database.py"
echo ""
echo "3. Start the backend:"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   uvicorn main:app --reload"
echo ""
echo "4. Start the frontend (in new terminal):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "5. Load Chrome Extension:"
echo "   - Open chrome://extensions/"
echo "   - Enable Developer mode"
echo "   - Click 'Load unpacked'"
echo "   - Select the 'extension' folder"
echo ""
echo "6. Get your API keys:"
echo "   - OpenAI: https://platform.openai.com/"
echo "   - HuggingFace: https://huggingface.co/settings/tokens"
echo ""
echo "🎉 Happy networking!"
