/** @format */

import React, { useState, useEffect } from "react";
import cloudSync from "../firebase/cloudSync";
import { Shot, Session } from "../types";

interface CloudSyncSettingsProps {
  shots: Shot[];
  sessions: Session[];
  onDataMerged: (shots: Shot[], sessions: Session[]) => void;
}

export default function CloudSyncSettings({
  shots,
  sessions,
  onDataMerged,
}: CloudSyncSettingsProps) {
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedSync = localStorage.getItem("cloudSyncEnabled");
    if (savedSync === "true") {
      setSyncEnabled(true);
    }

    const savedLastSync = localStorage.getItem("lastSyncTime");
    if (savedLastSync) {
      setLastSync(new Date(savedLastSync));
    }
  }, []);

  const enableSync = async () => {
    setSyncing(true);
    setError(null);

    try {
      const success = await cloudSync.enableSync();
      if (success) {
        setSyncEnabled(true);
        // Initial sync
        await performSync();
      } else {
        setError("Failed to enable cloud sync");
      }
    } catch (err: any) {
      setError(err.message || "Error enabling cloud sync");
    } finally {
      setSyncing(false);
    }
  };

  const disableSync = async () => {
    try {
      await cloudSync.disableSync();
      setSyncEnabled(false);
      localStorage.removeItem("lastSyncTime");
    } catch (err: any) {
      setError(err.message || "Error disabling cloud sync");
    }
  };

  const performSync = async () => {
    if (!syncEnabled && !cloudSync.isSyncEnabled()) {
      setError("Cloud sync is not enabled");
      return;
    }

    setSyncing(true);
    setError(null);

    try {
      // Merge local and cloud data
      const { shots: mergedShots, sessions: mergedSessions } =
        await cloudSync.mergeData(shots, sessions);

      // Update local data
      onDataMerged(mergedShots, mergedSessions);

      // Update last sync time
      const now = new Date();
      setLastSync(now);
      localStorage.setItem("lastSyncTime", now.toISOString());
    } catch (err: any) {
      setError(err.message || "Error syncing data");
    } finally {
      setSyncing(false);
    }
  };

  const deleteCloudData = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete all cloud data? This cannot be undone.",
      )
    ) {
      return;
    }

    setSyncing(true);
    setError(null);

    try {
      await cloudSync.deleteAllData();
      alert("Cloud data deleted successfully");
    } catch (err: any) {
      setError(err.message || "Error deleting cloud data");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className='cloud-sync-settings'>
      <h3>☁️ Cloud Sync</h3>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Sync your golf data across devices using Firebase
      </p>

      {error && (
        <div
          className='error-message'
          style={{ color: "#f44336", marginBottom: "16px" }}>
          ⚠️ {error}
        </div>
      )}

      <div className='setting-item'>
        <div className='setting-info'>
          <strong>Enable Cloud Sync</strong>
          <p>Automatically sync your shots and sessions across devices</p>
        </div>
        {!syncEnabled ? (
          <button
            onClick={enableSync}
            disabled={syncing}
            className='btn-primary'>
            {syncing ? "Enabling..." : "Enable"}
          </button>
        ) : (
          <button
            onClick={disableSync}
            disabled={syncing}
            className='btn-secondary'>
            Disable
          </button>
        )}
      </div>

      {syncEnabled && (
        <>
          <div className='sync-status'>
            <p>
              <strong>Status:</strong>{" "}
              <span style={{ color: "#4caf50" }}>✅ Connected</span>
            </p>
            {lastSync && (
              <p>
                <strong>Last Sync:</strong> {lastSync.toLocaleString()}
              </p>
            )}
          </div>

          <div className='sync-actions'>
            <button
              onClick={performSync}
              disabled={syncing}
              className='btn-primary'>
              {syncing ? "Syncing..." : "Sync Now"}
            </button>

            <button
              onClick={deleteCloudData}
              disabled={syncing}
              className='btn-danger'
              style={{ marginLeft: "10px" }}>
              Delete Cloud Data
            </button>
          </div>

          <div
            className='sync-info'
            style={{
              marginTop: "20px",
              padding: "16px",
              background: "#f8f9fa",
              borderRadius: "8px",
            }}>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "0.95rem" }}>
              ℹ️ About Cloud Sync
            </h4>
            <ul
              style={{
                margin: "8px 0",
                paddingLeft: "20px",
                fontSize: "0.9rem",
                color: "#666",
              }}>
              <li>Data is synced automatically when enabled</li>
              <li>Local and cloud data are merged intelligently</li>
              <li>Your data is stored securely in Firebase</li>
              <li>Anonymous authentication is used (no login required)</li>
            </ul>
          </div>
        </>
      )}

      {!syncEnabled && (
        <div
          className='setup-instructions'
          style={{
            marginTop: "20px",
            padding: "16px",
            background: "#fff3cd",
            borderRadius: "8px",
          }}>
          <h4 style={{ margin: "0 0 8px 0", fontSize: "0.95rem" }}>
            🔧 Setup Required
          </h4>
          <p style={{ margin: "0", fontSize: "0.9rem", color: "#856404" }}>
            To use cloud sync, you need to configure Firebase. See{" "}
            <strong>.env.example</strong> for instructions.
          </p>
        </div>
      )}
    </div>
  );
}
