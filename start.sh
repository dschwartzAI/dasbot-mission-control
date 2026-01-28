#!/bin/bash

# Mission Control Dashboard - Quick Start Script

echo "🚀 DasBot Mission Control Dashboard"
echo "===================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if mission-control.json exists
if [ ! -f "/home/claudebot/clawd/mission-control.json" ]; then
    echo "⚠️  Warning: /home/claudebot/clawd/mission-control.json not found!"
    echo "   Creating sample data file..."
    cp mission-control.sample.json /home/claudebot/clawd/mission-control.json 2>/dev/null || true
    echo ""
fi

echo "🌟 Starting development server..."
echo ""
echo "📍 Dashboard will be available at: http://localhost:3000"
echo "🔄 Auto-refreshes every 30 seconds"
echo ""
echo "Press Ctrl+C to stop"
echo ""

npm run dev
