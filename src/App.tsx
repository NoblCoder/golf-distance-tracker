/** @format */

import React, { useState, useEffect, useMemo } from "react";
import AddShotForm from "./components/AddShotForm";
import ClubAverages from "./components/ClubAverages";
import ShotList from "./components/ShotList";
import Charts from "./components/Charts";
import Filters from "./components/Filters";
import Sessions from "./components/Sessions";
import Map from "./components/Map";
import RangeFinder from "./components/RangeFinder";
import InstallPrompt from "./components/InstallPrompt";
import { Shot, Session, Page, Filters as FilterType } from "./types";
import "./App.css";

function App() {
  const [shots, setShots] = useState<Shot[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("default");
  const [page, setPage] = useState<Page>("home");
  const [filters, setFilters] = useState<FilterType>({});
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  // Load data from localStorage
  useEffect(() => {
    const savedShots = localStorage.getItem("golfShots");
    const savedSessions = localStorage.getItem("golfSessions");

    if (savedShots) setShots(JSON.parse(savedShots));

    if (savedSessions) {
      const loadedSessions = JSON.parse(savedSessions);
      setSessions(loadedSessions);
    } else {
      // Create default session
      const defaultSession: Session = {
        id: "default",
        name: "Default Session",
        date: Date.now(),
      };
      setSessions([defaultSession]);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("golfShots", JSON.stringify(shots));
  }, [shots]);

  useEffect(() => {
    localStorage.setItem("golfSessions", JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  const addShot = (shot: Omit<Shot, "id" | "timestamp">) => {
    const newShot: Shot = {
      ...shot,
      id: `shot-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
    };
    setShots([...shots, newShot]);
  };

  const addSession = (session: Omit<Session, "id">) => {
    const newSession: Session = {
      ...session,
      id: `session-${Date.now()}`,
    };
    setSessions([...sessions, newSession]);
    setCurrentSessionId(newSession.id);
  };

  // Apply filters
  const filteredShots = useMemo(() => {
    return shots.filter((shot) => {
      if (filters.club && shot.club !== filters.club) return false;
      if (filters.shotType && shot.shotType !== filters.shotType) return false;
      if (filters.sessionId && shot.sessionId !== filters.sessionId)
        return false;
      if (filters.dateFrom && shot.timestamp < filters.dateFrom) return false;
      if (filters.dateTo && shot.timestamp > filters.dateTo) return false;
      return true;
    });
  }, [shots, filters]);

  return (
    <div className='container'>
      <InstallPrompt />

      <header className='app-header'>
        <button
          className='burger-menu-btn'
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label='Toggle menu'>
          <span className='burger-line'></span>
          <span className='burger-line'></span>
          <span className='burger-line'></span>
        </button>
        <h1>🏌️‍♂️ Golf Distance Tracker</h1>
        <button
          className='dark-mode-toggle'
          onClick={() => setDarkMode(!darkMode)}
          aria-label='Toggle dark mode'>
          {darkMode ? "☀️" : "🌙"}
        </button>
      </header>

      {/* Overlay */}
      {menuOpen && (
        <div className='menu-overlay' onClick={() => setMenuOpen(false)}></div>
      )}

      {/* Slide-out Menu */}
      <nav className={`slide-menu ${menuOpen ? "open" : ""}`}>
        <div className='menu-header'>
          <h2>Menu</h2>
          <button
            className='close-menu-btn'
            onClick={() => setMenuOpen(false)}
            aria-label='Close menu'>
            ✕
          </button>
        </div>
        <button
          className={page === "home" ? "menu-item active" : "menu-item"}
          onClick={() => {
            setPage("home");
            setMenuOpen(false);
          }}>
          <span className='menu-icon'>📊</span>
          <span>Dashboard</span>
        </button>
        <button
          className={page === "rangefinder" ? "menu-item active" : "menu-item"}
          onClick={() => {
            setPage("rangefinder");
            setMenuOpen(false);
          }}>
          <span className='menu-icon'>📏</span>
          <span>Range Finder</span>
        </button>
        <button
          className={page === "map" ? "menu-item active" : "menu-item"}
          onClick={() => {
            setPage("map");
            setMenuOpen(false);
          }}>
          <span className='menu-icon'>🗺️</span>
          <span>Shot Map</span>
        </button>
        <button
          className={page === "charts" ? "menu-item active" : "menu-item"}
          onClick={() => {
            setPage("charts");
            setMenuOpen(false);
          }}>
          <span className='menu-icon'>📈</span>
          <span>Charts</span>
        </button>
        <button
          className={page === "history" ? "menu-item active" : "menu-item"}
          onClick={() => {
            setPage("history");
            setMenuOpen(false);
          }}>
          <span className='menu-icon'>📜</span>
          <span>History</span>
        </button>
        <button
          className={page === "sessions" ? "menu-item active" : "menu-item"}
          onClick={() => {
            setPage("sessions");
            setMenuOpen(false);
          }}>
          <span className='menu-icon'>📅</span>
          <span>Sessions</span>
        </button>
      </nav>

      {page === "home" && (
        <>
          <div className='card'>
            <AddShotForm
              addShot={addShot}
              currentSessionId={currentSessionId}
            />
          </div>

          <div className='card'>
            <ClubAverages shots={shots} />
          </div>
        </>
      )}

      {page === "charts" && (
        <div className='card'>
          <Charts shots={filteredShots} />
        </div>
      )}

      {page === "history" && (
        <>
          <div className='card'>
            <Filters
              filters={filters}
              setFilters={setFilters}
              sessions={sessions}
            />
          </div>
          <div className='card'>
            <ShotList shots={filteredShots} />
          </div>
        </>
      )}

      {page === "sessions" && (
        <div className='card'>
          <Sessions
            sessions={sessions}
            currentSessionId={currentSessionId}
            setCurrentSessionId={setCurrentSessionId}
            addSession={addSession}
          />
        </div>
      )}

      {page === "map" && (
        <div className='card'>
          <Map shots={filteredShots} />
        </div>
      )}

      {page === "rangefinder" && (
        <div className='card'>
          <RangeFinder />
        </div>
      )}
    </div>
  );
}

export default App;
