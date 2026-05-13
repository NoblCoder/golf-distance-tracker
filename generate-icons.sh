#!/bin/bash

# Golf Tracker - Icon Generator Script
# Place your source image as 'golf-tracker-icon.png' in the public folder
# Then run: bash generate-icons.sh

SOURCE="public/golf-tracker-icon.png"
PUBLIC_DIR="public"

if [ ! -f "$SOURCE" ]; then
    echo "❌ Error: Please save your Golf Tracker image as 'public/golf-tracker-icon.png'"
    echo ""
    echo "Then run this script again!"
    exit 1
fi

echo "🏌️ Generating Golf Tracker icons..."

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not found. Please install it:"
    echo "   macOS: brew install imagemagick"
    echo "   Ubuntu: sudo apt-get install imagemagick"
    echo ""
    echo "Or use an online tool:"
    echo "   https://favicon.io/"
    echo "   https://realfavicongenerator.net/"
    exit 1
fi

# Generate 192x192 PNG
echo "📱 Creating logo192.png (192x192)..."
convert "$SOURCE" -resize 192x192 "$PUBLIC_DIR/logo192.png"

# Generate 512x512 PNG
echo "📱 Creating logo512.png (512x512)..."
convert "$SOURCE" -resize 512x512 "$PUBLIC_DIR/logo512.png"

# Generate favicon.ico
echo "📱 Creating favicon.ico (32x32)..."
convert "$SOURCE" -resize 32x32 "$PUBLIC_DIR/favicon.ico"

echo ""
echo "✅ All icons generated successfully!"
echo ""
echo "Files created:"
echo "  ✓ public/logo192.png"
echo "  ✓ public/logo512.png"
echo "  ✓ public/favicon.ico"
echo ""
echo "🚀 Run 'npm start' to see your new app icon!"
