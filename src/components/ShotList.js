/** @format */

import React from "react";

export default function ShotList({ shots }) {
  const reversed = [...shots].reverse();

  return (
    <>
      <h2>Shot History ({shots.length} total)</h2>
      {shots.length === 0 && <p>No shots recorded</p>}

      <div className='shot-history'>
        {reversed.map((s, i) => (
          <div key={i} className='shot-item'>
            <span className='shot-club'>{s.club}</span>
            <span className='shot-distance'>{s.distance} yds</span>
            <span className='shot-type'>{s.shotType}</span>
          </div>
        ))}
      </div>
    </>
  );
}
