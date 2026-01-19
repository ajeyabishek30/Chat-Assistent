#!/bin/bash

# Firebase Setup Helper Script
# This script helps you configure your Firebase project

echo "🔥 Firebase Chat Assistant Setup"
echo "=================================="
echo ""
echo "Project ID: chat-assistant-6112c"
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found!"
    echo "📦 Installing Firebase CLI..."
    npm install -g firebase-tools
fi

echo "✅ Firebase CLI is installed"
echo ""

# Check if user is logged in
echo "🔐 Checking Firebase login status..."
firebase projects:list &> /dev/null

if [ $? -ne 0 ]; then
    echo "❌ Not logged in to Firebase"
    echo "🔑 Please login to Firebase:"
    firebase login
else
    echo "✅ Already logged in to Firebase"
fi

echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Get your Firebase configuration:"
echo "   👉 https://console.firebase.google.com/project/chat-assistant-6112c/settings/general"
echo ""
echo "2. Create frontend/.env.local with your Firebase config"
echo "   (Use frontend/.env.example as template)"
echo ""
echo "3. Install all dependencies:"
echo "   npm run install:all"
echo ""
echo "4. Deploy to Firebase:"
echo "   npm run deploy:all"
echo ""
echo "📚 For detailed instructions, see:"
echo "   - DEPLOY.md (Quick deployment guide)"
echo "   - FIREBASE_SETUP.md (Complete documentation)"
echo ""

# Check if .env.local exists
if [ ! -f "frontend/.env.local" ]; then
    echo "⚠️  frontend/.env.local not found!"
    echo ""
    read -p "Would you like to create it now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cp frontend/.env.example frontend/.env.local
        echo "✅ Created frontend/.env.local from template"
        echo "📝 Please edit frontend/.env.local and add your Firebase config"
        echo ""
        read -p "Press Enter to open the file in nano editor..." -n 1 -r
        nano frontend/.env.local
    fi
else
    echo "✅ frontend/.env.local exists"
fi

echo ""
echo "🚀 Setup complete! You can now:"
echo "   - Run locally: npm run dev (legacy) or npm run emulators:start"
echo "   - Deploy: npm run deploy:all"
echo ""
