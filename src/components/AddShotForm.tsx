/** @format */

import React, { useState } from "react";
import { Shot } from "../types";
import { getCurrentLocation } from "../utils/gpsHelper";

const clubs = [
  "Driver",
  "3 Wood",
  "5 Wood",
  "3 Iron",
  "4 Iron",
  "5 Iron",
  "6 Iron",
  "7 Iron",
  "8 Iron",
  "9 Iron",
  "PW",
  "GW",
  "SW",
  "LW",
];

const shotTypes = ["Normal", "Stinger", "Flop", "Punch", "Knockdown"];

interface AddShotFormProps {
  addShot: (shot: Omit<Shot, "id" | "timestamp">) => void;
  currentSessionId: string;
}

export default function AddShotForm({
  addShot,
  currentSessionId,
}: AddShotFormProps) {
  const [club, setClub] = useState("Driver");
  const [distance, setDistance] = useState("");
  const [shotType, setShotType] = useState("Normal");
  const [courseName, setCourseName] = useState("");
  const [holeNumber, setHoleNumber] = useState("");
  const [showHoleDetails, setShowHoleDetails] = useState(false);
  const [holePar, setHolePar] = useState("");
  const [holeYardage, setHoleYardage] = useState("");
  const [holeHandicap, setHoleHandicap] = useState("");
  const [trackDispersion, setTrackDispersion] = useState(false);
  const [offline, setOffline] = useState("");
  const [short, setShort] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!distance) return;

    setIsGettingLocation(true);
    let gps: { lat: number; lng: number } | undefined;

    // Always try to get GPS location
    try {
      gps = await getCurrentLocation();
    } catch (error) {
      console.error("Failed to get GPS location:", error);
      // Continue without GPS if it fails
    }
    setIsGettingLocation(false);

    const dispersion = trackDispersion
      ? {
          offline: Number(offline) || 0,
          short: Number(short) || 0,
        }
      : undefined;

    addShot({
      club,
      distance: Number(distance),
      shotType,
      sessionId: currentSessionId,
      courseName: courseName || undefined,
      holeNumber: holeNumber ? Number(holeNumber) : undefined,
      holePar: holePar ? Number(holePar) : undefined,
      holeYardage: holeYardage ? Number(holeYardage) : undefined,
      holeHandicap: holeHandicap ? Number(holeHandicap) : undefined,
      gps,
      dispersion,
    });

    setDistance("");
    setOffline("");
    setShort("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Shot 📍</h2>
      <p className='gps-indicator'>🌍 GPS tracking enabled</p>

      <label>Club</label>
      <select value={club} onChange={(e) => setClub(e.target.value)}>
        {clubs.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>

      <label>Distance (yards)</label>
      <input
        type='number'
        value={distance}
        onChange={(e) => setDistance(e.target.value)}
        required
      />

      <label>Shot Type</label>
      <select value={shotType} onChange={(e) => setShotType(e.target.value)}>
        {shotTypes.map((t) => (
          <option key={t}>{t}</option>
        ))}
      </select>

      <label>Course Name (optional)</label>
      <input
        type='text'
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
        placeholder='e.g., Pebble Beach'
      />

      <label>Hole Number (optional)</label>
      <input
        type='number'
        value={holeNumber}
        onChange={(e) => setHoleNumber(e.target.value)}
        placeholder='1-18'
        min='1'
        max='18'
      />

      {holeNumber && (
        <div className='checkbox-group'>
          <label className='checkbox-label'>
            <input
              type='checkbox'
              checked={showHoleDetails}
              onChange={(e) => setShowHoleDetails(e.target.checked)}
            />
            <span>Add hole details</span>
          </label>
        </div>
      )}

      {showHoleDetails && holeNumber && (
        <div className='hole-details'>
          <div>
            <label>Par</label>
            <input
              type='number'
              value={holePar}
              onChange={(e) => setHolePar(e.target.value)}
              placeholder='3-5'
              min='3'
              max='5'
            />
          </div>
          <div>
            <label>Yardage</label>
            <input
              type='number'
              value={holeYardage}
              onChange={(e) => setHoleYardage(e.target.value)}
              placeholder='e.g., 425'
            />
          </div>
          <div>
            <label>Handicap</label>
            <input
              type='number'
              value={holeHandicap}
              onChange={(e) => setHoleHandicap(e.target.value)}
              placeholder='1-18'
              min='1'
              max='18'
            />
          </div>
        </div>
      )}

      <div className='checkbox-group'>
        <label className='checkbox-label'>
          <input
            type='checkbox'
            checked={trackDispersion}
            onChange={(e) => setTrackDispersion(e.target.checked)}
          />
          <span>Track Dispersion</span>
        </label>
      </div>

      {trackDispersion && (
        <div className='dispersion-inputs'>
          <div>
            <label>Offline (yds)</label>
            <input
              type='number'
              value={offline}
              onChange={(e) => setOffline(e.target.value)}
              placeholder='- left, + right'
              step='0.5'
            />
          </div>
          <div>
            <label>Short/Long (yds)</label>
            <input
              type='number'
              value={short}
              onChange={(e) => setShort(e.target.value)}
              placeholder='- short, + long'
              step='0.5'
            />
          </div>
        </div>
      )}

      <button type='submit' disabled={isGettingLocation}>
        {isGettingLocation ? "Getting GPS..." : "Add Shot"}
      </button>
    </form>
  );
}
