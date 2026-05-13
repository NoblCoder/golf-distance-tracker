/** @format */

import React, { useState, useEffect, useMemo } from "react";
import AddShotForm from "./components/AddShotForm";
import ClubAverages from "./components/ClubAverages";
import ShotList from "./components/ShotList";
import Charts from "./components/Charts";
import Filters from "./components/Filters";
import Sessions from "./components/Sessions";
import Map from "./components/Map";
import { Shot, Session, Page, Filters as FilterType } from "./types";
import "./App.css";

function App() {
  const [shots, setShots] = useState<Shot[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("default");
  const [page, setPage] = useState<Page>("home");
  const [filters, setFilters] = useState<FilterType>({});
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
      <header className='app-header'>
        <h1>🏌️‍♂️ Golf Distance Tracker</h1>
        <button
          className='dark-mode-toggle'
          onClick={() => setDarkMode(!darkMode)}
          aria-label='Toggle dark mode'>
          {darkMode ? "☀️" : "🌙"}
        </button>
      </header>

      <nav className='nav-bar'>
        <button
          className={page === "home" ? "nav-btn active" : "nav-btn"}
          onClick={() => setPage("home")}>
          📊 Dashboard
        </button>
        <button
          className={page === "charts" ? "nav-btn active" : "nav-btn"}
          onClick={() => setPage("charts")}>
          📈 Charts
        </button>
        <button
          className={page === "history" ? "nav-btn active" : "nav-btn"}
          onClick={() => setPage("history")}>
          📜 History
        </button>
        <button
          className={page === "sessions" ? "nav-btn active" : "nav-btn"}
          onClick={() => setPage("sessions")}>
          📅 Sessions
        </button>
        <button
          className={page === "map" ? "nav-btn active" : "nav-btn"}
          onClick={() => setPage("map")}>
          🗺️ Map
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
    </div>
  );
}

export default App;
