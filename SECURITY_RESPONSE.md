<!-- @format -->

# 🚨 SECURITY INCIDENT: Exposed API Key

## What Happened

Your Google Maps API key (`AIzaSyCceyKj5GW9xFsybHvjl9dwUSyVvmp-bNU`) was exposed in your GitHub repository in the `gh-pages` branch (commit 6ad3810). The key is embedded in the built JavaScript files that are publicly accessible at your GitHub Pages site.

GitHub's secret scanning detected this and sent you an alert.

---

## IMMEDIATE ACTIONS (Do These NOW)

### 1️⃣ REVOKE THE EXPOSED KEY (CRITICAL - Do First!)

**Visit Google Cloud Console:**

1. Go to: https://console.cloud.google.com/apis/credentials
2. Find the API key: `AIzaSyCceyKj5GW9xFsybHvjl9dwUSyVvmp-bNU`
3. Click on it and select **"Delete"** or **"Regenerate"**
4. Confirm deletion

**Why:** Anyone with this key can use your Google Maps quota and you may be charged.

---

### 2️⃣ CLEAN THE GIT HISTORY

The key is in your `gh-pages` branch. You have two options:

#### Option A: Delete and Recreate gh-pages (RECOMMENDED - Easiest)

```bash
# Delete the old gh-pages branch
git push origin --delete gh-pages

# The next deployment will create a clean gh-pages branch
```

#### Option B: Use BFG Repo-Cleaner (Advanced)

```bash
# Install BFG (if not installed)
brew install bfg

# Clone a fresh copy of your repo
git clone --mirror https://github.com/NoblCoder/golf-distance-tracker.git
cd golf-distance-tracker.git

# Remove the sensitive data
bfg --replace-text <(echo "AIzaSyCceyKj5GW9xFsybHvjl9dwUSyVvmp-bNU==>REMOVED")

# Force push
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push --force
```

---

### 3️⃣ GENERATE A NEW API KEY

**In Google Cloud Console:**

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click **"+ CREATE CREDENTIALS"** → **"API key"**
3. Copy the new key

**Restrict the new key (IMPORTANT):**

1. Click on the new key
2. Under **"Application restrictions"**:
   - Select **"HTTP referrers (web sites)"**
   - Add: `https://noblcoder.github.io/golf-distance-tracker/*`
   - Add: `http://localhost:3000/*` (for development)
3. Under **"API restrictions"**:
   - Select **"Restrict key"**
   - Enable only: **"Maps JavaScript API"** and **"Geocoding API"**
4. Click **"Save"**

---

### 4️⃣ UPDATE YOUR LOCAL .env.local FILE

```bash
# Edit .env.local
echo "REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_NEW_KEY_HERE" > .env.local
```

Replace `YOUR_NEW_KEY_HERE` with your new restricted key.

---

### 5️⃣ COMMIT THE SECURITY FIXES

```bash
# Commit the improved .gitignore and placeholder changes
git add .gitignore .env.example src/firebase/config.ts
git commit -m "security: improve .gitignore and remove sensitive placeholders"
git push origin main
```

---

### 6️⃣ REBUILD AND REDEPLOY

```bash
# Build with your new key
npm run build

# Deploy to gh-pages (creates clean branch if deleted in step 2)
npx gh-pages -d build
```

---

## WHAT WE FIXED

1. ✅ **Enhanced .gitignore**: Now ignores `.env` and all `.env.*` files
2. ✅ **Updated placeholders**: Changed Firebase config placeholders to not trigger secret scanners
3. ✅ **Clearer .env.example**: Added warnings that values are examples only

---

## VERIFY THE FIX

After completing all steps:

1. **Check GitHub Security Alerts:**
   - Go to: https://github.com/NoblCoder/golf-distance-tracker/security
   - The alert should be marked as resolved or you can dismiss it

2. **Check the deployed site:**
   - Inspect: https://noblcoder.github.io/golf-distance-tracker/
   - Open DevTools → Sources → Check the JS files
   - Your new key should be there (that's normal for client-side apps)
   - But the OLD exposed key should be gone from git history

3. **Monitor API usage:**
   - Go to: https://console.cloud.google.com/apis/dashboard
   - Watch for unusual traffic on your new key
   - The old key should show no traffic (because it's deleted)

---

## IMPORTANT NOTES

### Client-Side API Keys Are Visible

React apps bundle API keys into the JavaScript, so they're always visible in the browser. This is **normal and expected**. The security comes from:

- **API key restrictions** (HTTP referrers, API restrictions)
- **Not committing keys to git** (use .env files)
- **Quota limits** in Google Cloud Console

### Future Prevention

✅ Always use `.env` or `.env.local` for secrets  
✅ Never commit `.env` files  
✅ Always restrict API keys in Google Cloud Console  
✅ Enable billing alerts to catch abuse early

---

## Questions?

If you need help with any step, let me know!
