/** @format */

import React, { useState, useEffect } from "react";
import AddShotForm from "./components/AddShotForm";
import ClubAverages from "./components/ClubAverages";
import ShotList from "./components/ShotList";
import "./App.css";

function App() {
  const [shots, setShots] = useState([]);
  const [page, setPage] = useState("home");

  useEffect(() => {
    const saved = localStorage.getItem("golfShots");
    if (saved) setShots(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("golfShots", JSON.stringify(shots));
  }, [shots]);

  const addShot = (shot) => {
    setShots([...shots, shot]);
  };

  return (
    <div className='container'>
      <h1>🏌️‍♂️ Golf Distance Tracker</h1>

      <nav className='nav-bar'>
        <button
          className={page === "home" ? "nav-btn active" : "nav-btn"}
          onClick={() => setPage("home")}>
          📊 Dashboard
        </button>
        <button
          className={page === "history" ? "nav-btn active" : "nav-btn"}
          onClick={() => setPage("history")}>
          📜 Shot History
        </button>
      </nav>

      {page === "home" && (
        <>
          <div className='card'>
            <AddShotForm addShot={addShot} />
          </div>

          <div className='card'>
            <ClubAverages shots={shots} />
          </div>
        </>
      )}

      {page === "history" && (
        <div className='card'>
          <ShotList shots={shots} />
        </div>
      )}
    </div>
  );
}

export default App;
