#!/bin/bash
# Icon and Splash Screen Generator for Golf Distance Tracker
set -e

echo "🏌️‍♂️ Golf Distance Tracker - Icon & Splash Generator"
echo "=================================================="

# Check if ImageMagick is installed
if ! command -v magick &>/dev/null && ! command -v convert &>/dev/null; then
    echo "❌ ImageMagick is not installed."
    echo "📦 Install it with: brew install imagemagick"
    exit 1
fi

CMD="magick"
if ! command -v magick &>/dev/null; then
    CMD="convert"
fi

echo "✅ ImageMagick found"

# Create base icon
echo "🎨 Creating base icons..."
# Create 512x512 icon with gradient
$CMD -size 512x512 gradient:'#667eea'-'#764ba2' \
    -swirl 135 \
    \( -size 512x512 xc:none -draw "circle 256,256 250,256" -blur 0x10 \) \
    -compose Screen -composite \
    public/logo512.png

# Create variations
$CMD public/logo512.png -resize 192x192 public/logo192.png
$CMD public/logo512.png -resize 180x180 public/apple-touch-icon.png
$CMD public/logo512.png -resize 180x180 public/apple-touch-icon-180x180.png
$CMD public/logo512.png -resize 167x167 public/apple-touch-icon-167x167.png
$CMD public/logo512.png -resize 152x152 public/apple-touch-icon-152x152.png
$CMD public/logo512.png -resize 32x32 public/favicon.ico

echo "✅ Icons created"

# Create splash screens
echo "🎨 Creating splash screens..."
mkdir -p public/splash
create_splash() {
    $CMD -size $1x$2 gradient:'#667eea'-'#764ba2' "public/splash/apple-splash-$1-$2.png"
}
create_splash 640 1136
create_splash 750 1334
create_splash 1242 2208
create_splash 1125 2436
create_splash 828 1792
create_splash 1242 2688
create_splash 1536 2048
create_splash 1668 2224
create_splash 1668 2388
create_splash 2048 2732

echo "✅ Splash screens created"

# Create screenshots
echo "📸 Creating screenshots..."
mkdir -p public/screenshots
$CMD -size 400x850 gradient:'#667eea'-'#764ba2' public/screenshots/mobile-1.png
$CMD -size 1280x800 gradient:'#667eea'-'#764ba2' public/screenshots/desktop-1.png

echo "✅ Screenshots created"
echo ""
echo "🎉 Done! All assets generated."
