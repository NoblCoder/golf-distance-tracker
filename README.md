# 🏌️‍♂️ Golf Distance Tracker

A comprehensive golf shot tracking app with advanced analytics, built with React and TypeScript.

## ✨ Features

### 📊 Core Features
- **Shot Tracking**: Record club, distance, and shot type for every shot
- **Club Averages**: View average distances with min/max ranges for each club
- **Shot History**: Complete history of all shots with export capability

### 📈 Advanced Analytics
- **Charts (Recharts)**: 
  - Average distance by club (bar chart)
  - Distance distribution (histogram)
  - Shot dispersion scatter plot
- **Filters**: Filter shots by club, shot type, session, and date range
- **Dispersion Tracking**: Track offline and short/long dispersion for accuracy analysis

### 🗺️ GPS & Location
- **GPS Shot Mapping**: Track GPS coordinates for each shot
- **Location-Based Sessions**: Associate practice sessions with locations
- **GPS shot list**: View all shots with GPS data

### 📅 Session Management
- **Practice Session Grouping**: Organize shots into practice sessions
- **Session Tracking**: Name sessions and track dates/locations
- **Active Session**: Easily switch between sessions

### 💾 Data Management
- **CSV Export**: Export all shot data to CSV for external analysis
- **Local Storage**: All data saved locally in browser
- **Data Persistence**: Never lose your shots

### 🎨 User Experience
- **Dark Mode**: Toggle between light and dark themes
- **Mobile-First UI**: Fully responsive design optimized for mobile
- **Eye-catching Animations**: Smooth transitions and hover effects
- **Multi-Page Navigation**: Organized into Dashboard, Charts, History, Sessions, and Map views

### 📱 PWA Support
- **Progressive Web App**: Install on your device for app-like experience
- **Offline Support**: Service worker for offline functionality
- **Home Screen Installation**: Add to home screen on mobile devices

## 🚀 Getting Started

### Installation

\`\`\`bash
npm install
\`\`\`

### Development

\`\`\`bash
npm start
\`\`\`

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Build

\`\`\`bash
npm run build
\`\`\`

Builds the app for production to the \`build\` folder.

## 🛠️ Technology Stack

- **React** (v18) - UI framework
- **TypeScript** - Type safety and better DX
- **Recharts** - Data visualization
- **date-fns** - Date formatting and manipulation
- **CSS3** - Animations and responsive design
- **Service Workers** - PWA capabilities
- **Local Storage** - Client-side data persistence

## 📱 Pages

### Dashboard (📊)
- Add new shots with optional GPS and dispersion tracking
- Filter shots by various criteria
- View club averages at a glance

### Charts (📈)
- Visual analytics with multiple chart types
- Interactive data visualization
- Dispersion analysis

### History (📜)
- Complete shot list with all details
- Export to CSV functionality
- Filter and search capabilities

### Sessions (📅)
- Create and manage practice sessions
- Switch between sessions
- Track session locations and dates

### Map (🗺️)
- View GPS-tracked shots
- Visualize shot locations
- Ready for map library integration (Leaflet/Google Maps)

## 🎯 Shot Types

- Normal
- Stinger
- Flop
- Punch
- Knockdown

## 🏌️ Clubs Supported

Driver, 3 Wood, 5 Wood, 3-9 Irons, PW, GW, SW, LW

## 💡 Tips

1. **Enable GPS** for location-based shot tracking
2. **Track Dispersion** to analyze shot accuracy
3. **Use Sessions** to organize practice rounds
4. **Export Data** regularly for backup
5. **Toggle Dark Mode** for comfortable viewing in different lighting

## 🔐 Privacy

All data is stored locally in your browser. No data is sent to external servers.

## 📝 License

MIT

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ⛳ by golf enthusiasts, for golf enthusiasts.
