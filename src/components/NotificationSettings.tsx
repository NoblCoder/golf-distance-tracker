/** @format */

import React, { useState, useEffect } from "react";
import notificationManager from "../utils/notifications";

export default function NotificationSettings() {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [reminderTimerId, setReminderTimerId] = useState<number | null>(null);

  useEffect(() => {
    if (notificationManager.isSupported()) {
      setPermission(notificationManager.getPermission());
    }

    // Load reminder preference from localStorage
    const savedReminders = localStorage.getItem("remindersEnabled");
    if (savedReminders) {
      setRemindersEnabled(JSON.parse(savedReminders));
    }
  }, []);

  const requestPermission = async () => {
    const result = await notificationManager.requestPermission();
    setPermission(result);

    if (result === "granted") {
      // Show welcome notification
      notificationManager.showNotification({
        title: "🏌️‍♂️ Notifications Enabled!",
        body: "You'll now receive practice reminders and updates",
      });
    }
  };

  const toggleReminders = () => {
    const newState = !remindersEnabled;
    setRemindersEnabled(newState);
    localStorage.setItem("remindersEnabled", JSON.stringify(newState));

    if (newState && permission === "granted") {
      // Schedule daily practice reminder (24 hours)
      const timerId = notificationManager.scheduleReminder(
        "Time to practice your golf shots! 🏌️‍♂️",
        24 * 60 * 60 * 1000,
      );
      if (timerId) {
        setReminderTimerId(timerId);
      }
    } else if (reminderTimerId) {
      // Cancel existing reminder
      notificationManager.cancelReminder(reminderTimerId);
      setReminderTimerId(null);
    }
  };

  const testNotification = () => {
    if (permission === "granted") {
      notificationManager.showNotification({
        title: "🎯 Test Notification",
        body: "Your notifications are working perfectly!",
      });
    }
  };

  if (!notificationManager.isSupported()) {
    return (
      <div className='notification-settings'>
        <h3>📱 Notifications</h3>
        <p style={{ color: "#999" }}>
          Notifications are not supported in this browser.
        </p>
      </div>
    );
  }

  return (
    <div className='notification-settings'>
      <h3>📱 Notification Settings</h3>

      <div className='setting-item'>
        <div className='setting-info'>
          <strong>Enable Notifications</strong>
          <p>Receive practice reminders and achievement updates</p>
        </div>
        {permission === "default" && (
          <button onClick={requestPermission} className='btn-primary'>
            Enable
          </button>
        )}
        {permission === "granted" && (
          <span style={{ color: "#4caf50", fontWeight: "bold" }}>
            ✅ Enabled
          </span>
        )}
        {permission === "denied" && (
          <span style={{ color: "#f44336" }}>
            ❌ Blocked (enable in browser settings)
          </span>
        )}
      </div>

      {permission === "granted" && (
        <>
          <div className='setting-item'>
            <div className='setting-info'>
              <strong>Practice Reminders</strong>
              <p>Get daily reminders to track your golf shots</p>
            </div>
            <label className='toggle-switch'>
              <input
                type='checkbox'
                checked={remindersEnabled}
                onChange={toggleReminders}
              />
              <span className='toggle-slider'></span>
            </label>
          </div>

          <button onClick={testNotification} className='btn-secondary'>
            Test Notification
          </button>
        </>
      )}
    </div>
  );
}
