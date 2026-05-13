/** @format */

import React from "react";
import { Filters as FilterType, Session } from "../types";

interface FiltersProps {
  filters: FilterType;
  setFilters: (filters: FilterType) => void;
  sessions: Session[];
}

const clubs = [
  "All",
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

const shotTypes = ["All", "Normal", "Stinger", "Flop", "Punch", "Knockdown"];

export default function Filters({
  filters,
  setFilters,
  sessions,
}: FiltersProps) {
  const handleClearFilters = () => {
    setFilters({});
  };

  return (
    <div className='filters-container'>
      <h3>🔍 Filters</h3>

      <div className='filter-grid'>
        <div className='filter-item'>
          <label>Club</label>
          <select
            value={filters.club || "All"}
            onChange={(e) => {
              const value =
                e.target.value === "All" ? undefined : e.target.value;
              setFilters({ ...filters, club: value });
            }}>
            {clubs.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className='filter-item'>
          <label>Shot Type</label>
          <select
            value={filters.shotType || "All"}
            onChange={(e) => {
              const value =
                e.target.value === "All" ? undefined : e.target.value;
              setFilters({ ...filters, shotType: value });
            }}>
            {shotTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className='filter-item'>
          <label>Session</label>
          <select
            value={filters.sessionId || "All"}
            onChange={(e) => {
              const value =
                e.target.value === "All" ? undefined : e.target.value;
              setFilters({ ...filters, sessionId: value });
            }}>
            <option>All</option>
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button onClick={handleClearFilters} className='clear-filters-btn'>
        Clear Filters
      </button>
    </div>
  );
}
