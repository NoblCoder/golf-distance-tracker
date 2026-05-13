/** @format */

import React from "react";
import { Shot } from "../types";
import { format } from "date-fns";
import { exportToCSV } from "../utils/csvExport";

interface ShotListProps {
  shots: Shot[];
}

export default function ShotList({ shots }: ShotListProps) {
  const reversed = [...shots].reverse();

  const handleExport = () => {
    exportToCSV(shots);
  };

  return (
    <>
      <div className='shot-list-header'>
        <h2>Shot History ({shots.length} total)</h2>
        {shots.length > 0 && (
          <button onClick={handleExport} className='export-btn'>
            📥 Export CSV
          </button>
        )}
      </div>

      {shots.length === 0 && <p>No shots recorded</p>}

      <div className='shot-history'>
        {reversed.map((s) => (
          <div key={s.id} className='shot-item'>
            <div className='shot-main-info'>
              <span className='shot-club'>{s.club}</span>
              <span className='shot-distance'>{s.distance} yds</span>
              <span className='shot-type'>{s.shotType}</span>
            </div>
            <div className='shot-meta'>
              <span className='shot-date'>
                {format(new Date(s.timestamp), "MMM dd, HH:mm")}
              </span>
              {s.gps && <span className='shot-badge'>📍 GPS</span>}
              {s.dispersion && (
                <span className='shot-badge'>🎯 Dispersion</span>
              )}
            </div>
            {s.dispersion && (
              <div className='shot-dispersion'>
                Offline: {s.dispersion.offline > 0 ? "+" : ""}
                {s.dispersion.offline} yds | Short/Long:{" "}
                {s.dispersion.short > 0 ? "+" : ""}
                {s.dispersion.short} yds
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
