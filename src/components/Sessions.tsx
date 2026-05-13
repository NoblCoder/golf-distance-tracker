/** @format */

import React, { useState } from "react";
import { Session } from "../types";
import { format } from "date-fns";

interface SessionsProps {
  sessions: Session[];
  currentSessionId: string;
  setCurrentSessionId: (id: string) => void;
  addSession: (session: Omit<Session, "id">) => void;
}

export default function Sessions({
  sessions,
  currentSessionId,
  setCurrentSessionId,
  addSession,
}: SessionsProps) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    addSession({
      name,
      location: location || undefined,
      date: Date.now(),
    });

    setName("");
    setLocation("");
    setShowForm(false);
  };

  return (
    <div className='sessions-container'>
      <h2>📅 Practice Sessions</h2>

      <div className='current-session'>
        <label>Active Session</label>
        <select
          value={currentSessionId}
          onChange={(e) => setCurrentSessionId(e.target.value)}>
          {sessions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} - {format(new Date(s.date), "MMM dd, yyyy")}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        className='toggle-form-btn'>
        {showForm ? "✕ Cancel" : "+ New Session"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className='session-form'>
          <label>Session Name</label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='e.g., Morning Range Session'
            required
          />

          <label>Location (optional)</label>
          <input
            type='text'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder='e.g., Driving Range'
          />

          <button type='submit'>Create Session</button>
        </form>
      )}

      <div className='sessions-list'>
        <h3>All Sessions</h3>
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`session-item ${
              session.id === currentSessionId ? "active" : ""
            }`}
            onClick={() => setCurrentSessionId(session.id)}>
            <div className='session-name'>{session.name}</div>
            <div className='session-date'>
              {format(new Date(session.date), "MMM dd, yyyy HH:mm")}
            </div>
            {session.location && (
              <div className='session-location'>📍 {session.location}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
