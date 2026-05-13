<!-- @format -->

# Quick Start Guide

## 🚀 Running the App

The app has been successfully built! Here's how to use it:

### Start Development Server

```bash
npm start
```

Opens at http://localhost:3000

### Build for Production

```bash
npm run build
```

Creates optimized production build in `build/` folder

## 📱 Using the App

### 1. Dashboard (📊)

**Add Your First Shot:**

1. Select a club (e.g., "7 Iron")
2. Enter distance in yards
3. Choose shot type
4. **Optional:** Check "Track GPS Location" to save coordinates
5. **Optional:** Check "Track Dispersion" to record accuracy
6. Click "ADD SHOT"

**Filter Your Data:**

- Use the filters section to narrow down shots by club, type, or session

**View Averages:**

- Scroll down to see your average distance for each club
- See min/max ranges and shot counts

### 2. Charts (📈)

- View bar chart of average distances per club
- See distance distribution across ranges
- Analyze shot dispersion (if tracking enabled)

### 3. History (📜)

- View all shots in reverse chronological order
- See timestamps, GPS badges, and dispersion data
- **Export:** Click "📥 Export CSV" to download your data

### 4. Sessions (📅)

**Create a Session:**

1. Click "+ New Session"
2. Enter session name (e.g., "Morning Practice")
3. Optionally add location (e.g., "Pine Valley Range")
4. Click "Create Session"

**Switch Sessions:**

- Select from dropdown or click on session in list
- All new shots will be added to active session

### 5. Map (🗺️)

- View all shots that have GPS coordinates
- See coordinates for each tracked shot
- _Note: Full interactive map requires additional map library_

## 🌗 Dark Mode

Click the ☀️/🌙 button in the header to toggle between light and dark themes.
Your preference is saved automatically!

## 💾 Data Storage

- All data is saved locally in your browser
- No internet connection required after first load
- Data persists across sessions

## 📥 Exporting Data

1. Go to History page
2. Click "📥 Export CSV" button
3. Open in Excel, Google Sheets, or any CSV editor

CSV includes:

- Date/Time
- Club
- Distance
- Shot Type
- Session
- GPS coordinates (if tracked)
- Dispersion data (if tracked)

## 📱 Install as App (PWA)

**On Mobile (iOS/Android):**

1. Open in browser (Safari/Chrome)
2. Tap "Share" button
3. Select "Add to Home Screen"
4. App icon appears on home screen!

**On Desktop:**

1. Look for install icon in address bar
2. Click "Install"
3. App opens in own window!

## 💡 Pro Tips

1. **Track Consistently:** Log every practice session for best analytics
2. **Use Sessions:** Organize by date/location to track improvement over time
3. **Enable GPS:** Useful for tracking which range or course you're at
4. **Export Regularly:** Backup your data monthly
5. **Check Charts:** Watch for trends in your game
6. **Dispersion Data:** Track accuracy to find which clubs need practice

## 🎯 Best Practices

- **Warm-up shots:** Create a separate "Warm-up" session
- **Course vs Range:** Use different sessions to compare
- **Weather notes:** Add in session location (e.g., "Range - Windy")
- **Regular reviews:** Check charts weekly to spot improvements

## 🔧 Troubleshooting

**GPS not working?**

- Allow location permissions in browser
- Ensure you're outdoors with clear sky view

**Charts empty?**

- Add at least a few shots first
- Make sure filters aren't too restrictive

**Data disappeared?**

- Check browser's localStorage hasn't been cleared
- Export regularly as backup

**Dark mode not saving?**

- Check browser allows localStorage
- Clear cache and try again

## 🎉 You're Ready!

Start tracking your shots and watch your game improve! 🏌️‍♂️⛳

---

For full feature list, see README.md
For implementation details, see IMPLEMENTATION.md
