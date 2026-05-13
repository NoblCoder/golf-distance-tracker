/** @format */

import React from "react";
import { Shot } from "../types";

interface ClubAveragesProps {
  shots: Shot[];
}

export default function ClubAverages({ shots }: ClubAveragesProps) {
  const grouped = shots.reduce((acc: any, shot) => {
    if (!acc[shot.club]) acc[shot.club] = [];
    acc[shot.club].push(shot.distance);
    return acc;
  }, {});

  const averages = Object.entries(grouped).map(
    ([club, distances]: [string, any]) => ({
      club,
      avg: (
        distances.reduce((a: number, b: number) => a + b, 0) / distances.length
      ).toFixed(1),
      count: distances.length,
      max: Math.max(...distances),
      min: Math.min(...distances),
    }),
  );

  return (
    <>
      <h2>Club Averages</h2>
      {averages.length === 0 && <p>No shots yet</p>}
      <div className='averages-grid'>
        {averages.map((a) => (
          <div key={a.club} className='avg-item'>
            <div className='club-name'>{a.club}</div>
            <div className='club-avg'>{a.avg} yds</div>
            <div className='club-stats'>
              <span className='stat-label'>Range:</span> {a.min}-{a.max} yds
            </div>
            <div className='club-count'>
              {a.count} shot{a.count !== 1 ? "s" : ""}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
