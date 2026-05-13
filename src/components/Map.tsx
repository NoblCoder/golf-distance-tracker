/** @format */

import React from "react";
import { Shot } from "../types";

interface MapProps {
  shots: Shot[];
}

export default function Map({ shots }: MapProps) {
  const shotsWithGPS = shots.filter((shot) => shot.gps);

  return (
    <div className='map-container'>
      <h2>🗺️ GPS Shot Mapping</h2>

      {shotsWithGPS.length === 0 ? (
        <div className='empty-state'>
          <p>No GPS data available yet.</p>
          <p>Enable GPS tracking when adding shots to see them on the map!</p>
        </div>
      ) : (
        <div className='map-content'>
          <div className='map-placeholder'>
            <p>🌍 Interactive Map View</p>
            <p className='map-note'>
              GPS coordinates are being tracked. To display an interactive map,
              integrate with a mapping library like Leaflet or Google Maps.
            </p>
          </div>

          <div className='gps-shots-list'>
            <h3>Shots with GPS ({shotsWithGPS.length})</h3>
            {shotsWithGPS.map((shot, idx) => (
              <div key={shot.id} className='gps-shot-item'>
                <div className='shot-info'>
                  <span className='shot-club'>{shot.club}</span>
                  <span className='shot-distance'>{shot.distance} yds</span>
                </div>
                <div className='gps-coords'>
                  📍 {shot.gps!.lat.toFixed(6)}, {shot.gps!.lng.toFixed(6)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
