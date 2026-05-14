/** @format */

// Push Notification Manager for Golf Distance Tracker

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
}

export class NotificationManager {
  private static instance: NotificationManager;

  private constructor() {}

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  /**
   * Check if notifications are supported
   */
  isSupported(): boolean {
    return "Notification" in window && "serviceWorker" in navigator;
  }

  /**
   * Get current notification permission status
   */
  getPermission(): NotificationPermission {
    if (!this.isSupported()) {
      return "denied";
    }
    return Notification.permission;
  }

  /**
   * Request notification permission from user
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      console.warn("Notifications not supported");
      return "denied";
    }

    if (this.getPermission() === "granted") {
      return "granted";
    }

    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return "denied";
    }
  }

  /**
   * Show a local notification
   */
  async showNotification(options: NotificationOptions): Promise<void> {
    if (this.getPermission() !== "granted") {
      console.warn("Notification permission not granted");
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(options.title, {
        body: options.body,
        icon: options.icon || "/golf-distance-tracker/logo192.png",
        badge: options.badge || "/golf-distance-tracker/logo192.png",
        tag: options.tag || "golf-tracker-notification",
        data: options.data,
        requireInteraction: false,
      } as any);
    } catch (error) {
      console.error("Error showing notification:", error);
    }
  }

  /**
   * Schedule a reminder notification
   */
  scheduleReminder(message: string, delayMs: number = 3600000): number | null {
    if (this.getPermission() !== "granted") {
      return null;
    }

    const timerId = window.setTimeout(() => {
      this.showNotification({
        title: "⛳ Golf Practice Reminder",
        body: message,
        tag: "golf-reminder",
      });
    }, delayMs);

    return timerId;
  }

  /**
   * Cancel a scheduled reminder
   */
  cancelReminder(timerId: number): void {
    clearTimeout(timerId);
  }

  /**
   * Show session reminder
   */
  async showSessionReminder(sessionName: string): Promise<void> {
    await this.showNotification({
      title: "🏌️‍♂️ Practice Session Reminder",
      body: `Time for your "${sessionName}" practice session!`,
      tag: "session-reminder",
      data: { type: "session-reminder", sessionName },
    });
  }

  /**
   * Show achievement notification
   */
  async showAchievement(achievement: string): Promise<void> {
    await this.showNotification({
      title: "🎯 New Achievement!",
      body: achievement,
      tag: "achievement",
      data: { type: "achievement" },
    });
  }

  /**
   * Show stats notification
   */
  async showStats(message: string): Promise<void> {
    await this.showNotification({
      title: "📊 Your Golf Stats",
      body: message,
      tag: "stats",
      data: { type: "stats" },
    });
  }
}

export default NotificationManager.getInstance();
