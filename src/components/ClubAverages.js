/** @format */

import React from "react";

export default function ClubAverages({ shots }) {
  const grouped = shots.reduce((acc, shot) => {
    if (!acc[shot.club]) acc[shot.club] = [];
    acc[shot.club].push(shot.distance);
    return acc;
  }, {});

  const averages = Object.entries(grouped).map(([club, distances]) => ({
    club,
    avg: (distances.reduce((a, b) => a + b, 0) / distances.length).toFixed(1),
    count: distances.length,
  }));

  return (
    <>
      <h2>Club Averages</h2>
      {averages.length === 0 && <p>No shots yet</p>}
      <div className='averages-grid'>
        {averages.map((a) => (
          <div key={a.club} className='avg-item'>
            <div className='club-name'>{a.club}</div>
            <div className='club-avg'>{a.avg} yds</div>
            <div className='club-count'>
              {a.count} shot{a.count !== 1 ? "s" : ""}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
