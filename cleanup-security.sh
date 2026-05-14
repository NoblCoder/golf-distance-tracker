#!/bin/bash
# Security cleanup script for Golf Distance Tracker

echo "🔒 Starting security cleanup..."
echo ""

# Step 1: Remove local .env.local file (contains the exposed key)
if [ -f .env.local ]; then
    echo "✓ Removing .env.local (contains exposed key)"
    rm .env.local
else
    echo "✓ .env.local already removed"
fi

# Step 2: Clean up .env.example to remove Google Maps references
echo "✓ Updating .env.example to remove unused Google Maps API"
cat > .env.example << 'EOF'
# ==========================================
# Golf Distance Tracker - Environment Variables
# ==========================================
# 
# This app currently uses FREE services:
# - OpenStreetMap for maps (via Leaflet)
# - Nominatim for geocoding
# 
# No API keys required for basic functionality!
#
# ==========================================

# Firebase Configuration for Cloud Sync (Optional)
# ==========================================
# 
# To enable cloud sync:
# 1. Create a Firebase project at https://console.firebase.google.com/
# 2. Enable Firestore Database (in Build > Firestore Database)
# 3. Enable Anonymous Authentication (in Build > Authentication > Sign-in method)
# 4. Get your Firebase config from Project Settings > General > Your apps
# 5. Create a .env file and fill in your actual values below
# 6. Rebuild the app with: npm run build

REACT_APP_FIREBASE_API_KEY=REPLACE_WITH_YOUR_ACTUAL_FIREBASE_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN=REPLACE_WITH_YOUR_PROJECT_ID.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=REPLACE_WITH_YOUR_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET=REPLACE_WITH_YOUR_PROJECT_ID.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=REPLACE_WITH_YOUR_SENDER_ID
REACT_APP_FIREBASE_APP_ID=REPLACE_WITH_YOUR_APP_ID

# ==========================================
# Firestore Security Rules
# ==========================================
# Copy this to Firebase Console > Firestore Database > Rules:
#
# rules_version = '2';
# service cloud.firestore {
#   match /databases/{database}/documents {
#     match /users/{userId}/data/{document=**} {
#       allow read, write: if request.auth != null && request.auth.uid == userId;
#     }
#   }
# }
EOF

echo ""
echo "✅ Local cleanup complete!"
echo ""
echo "📋 NEXT STEPS:"
echo ""
echo "1. Confirm you've deleted the key in Google Console"
echo "2. Run these commands to clean git history and redeploy:"
echo ""
echo "   git add .env.example"
echo "   git commit -m 'security: remove unused Google Maps API references'"
echo "   git push origin main"
echo "   git push origin --delete gh-pages"
echo "   npm run build"
echo "   npx gh-pages -d build"
echo ""
echo "3. Verify the GitHub security alert is resolved"
echo ""
