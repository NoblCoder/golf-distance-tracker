/** @format */

import React from "react";
import NotificationSettings from "./NotificationSettings";
import CloudSyncSettings from "./CloudSyncSettings";
import { Shot, Session } from "../types";

interface SettingsProps {
  shots: Shot[];
  sessions: Session[];
  onDataMerged: (shots: Shot[], sessions: Session[]) => void;
}

export default function Settings({
  shots,
  sessions,
  onDataMerged,
}: SettingsProps) {
  return (
    <div className='settings-page'>
      <h2>⚙️ Settings</h2>

      <NotificationSettings />

      <CloudSyncSettings
        shots={shots}
        sessions={sessions}
        onDataMerged={onDataMerged}
      />

      <div
        className='app-info'
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "24px",
          marginTop: "20px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}>
        <h3>ℹ️ About</h3>
        <p>
          <strong>Golf Distance Tracker</strong>
        </p>
        <p>Version 2.0.0 - PWA Edition</p>
        <p style={{ fontSize: "0.9rem", color: "#666", marginTop: "12px" }}>
          Track your golf shots with GPS, analyze performance with charts, and
          sync across devices.
        </p>
      </div>
    </div>
  );
}
