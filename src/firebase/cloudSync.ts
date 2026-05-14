/** @format */

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { signInAnonymously, onAuthStateChanged, User } from "firebase/auth";
import { db, auth } from "./config";
import { Shot, Session } from "../types";

export class CloudSyncManager {
  private static instance: CloudSyncManager;
  private userId: string | null = null;
  private syncEnabled: boolean = false;

  private constructor() {
    this.initAuth();
  }

  static getInstance(): CloudSyncManager {
    if (!CloudSyncManager.instance) {
      CloudSyncManager.instance = new CloudSyncManager();
    }
    return CloudSyncManager.instance;
  }

  /**
   * Initialize authentication
   */
  private async initAuth(): Promise<void> {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.userId = user.uid;
        console.log("✅ Cloud sync authenticated:", user.uid);
      } else {
        this.userId = null;
        console.log("❌ Cloud sync not authenticated");
      }
    });
  }

  /**
   * Enable cloud sync (signs in anonymously)
   */
  async enableSync(): Promise<boolean> {
    try {
      const result = await signInAnonymously(auth);
      this.userId = result.user.uid;
      this.syncEnabled = true;
      localStorage.setItem("cloudSyncEnabled", "true");
      return true;
    } catch (error) {
      console.error("Error enabling cloud sync:", error);
      return false;
    }
  }

  /**
   * Disable cloud sync
   */
  async disableSync(): Promise<void> {
    this.syncEnabled = false;
    localStorage.setItem("cloudSyncEnabled", "false");
    await auth.signOut();
    this.userId = null;
  }

  /**
   * Check if sync is enabled
   */
  isSyncEnabled(): boolean {
    return this.syncEnabled && this.userId !== null;
  }

  /**
   * Get current user ID
   */
  getUserId(): string | null {
    return this.userId;
  }

  /**
   * Sync shots to cloud
   */
  async syncShots(shots: Shot[]): Promise<void> {
    if (!this.isSyncEnabled() || !this.userId) {
      throw new Error("Cloud sync not enabled");
    }

    try {
      const shotsRef = doc(db, "users", this.userId, "data", "shots");
      await setDoc(shotsRef, {
        shots: shots,
        lastSync: Timestamp.now(),
      });
      console.log("✅ Shots synced to cloud");
    } catch (error) {
      console.error("Error syncing shots:", error);
      throw error;
    }
  }

  /**
   * Load shots from cloud
   */
  async loadShots(): Promise<Shot[]> {
    if (!this.isSyncEnabled() || !this.userId) {
      throw new Error("Cloud sync not enabled");
    }

    try {
      const shotsRef = doc(db, "users", this.userId, "data", "shots");
      const shotsDoc = await getDoc(shotsRef);

      if (shotsDoc.exists()) {
        const data = shotsDoc.data();
        console.log("✅ Shots loaded from cloud");
        return data.shots || [];
      }

      return [];
    } catch (error) {
      console.error("Error loading shots:", error);
      throw error;
    }
  }

  /**
   * Sync sessions to cloud
   */
  async syncSessions(sessions: Session[]): Promise<void> {
    if (!this.isSyncEnabled() || !this.userId) {
      throw new Error("Cloud sync not enabled");
    }

    try {
      const sessionsRef = doc(db, "users", this.userId, "data", "sessions");
      await setDoc(sessionsRef, {
        sessions: sessions,
        lastSync: Timestamp.now(),
      });
      console.log("✅ Sessions synced to cloud");
    } catch (error) {
      console.error("Error syncing sessions:", error);
      throw error;
    }
  }

  /**
   * Load sessions from cloud
   */
  async loadSessions(): Promise<Session[]> {
    if (!this.isSyncEnabled() || !this.userId) {
      throw new Error("Cloud sync not enabled");
    }

    try {
      const sessionsRef = doc(db, "users", this.userId, "data", "sessions");
      const sessionsDoc = await getDoc(sessionsRef);

      if (sessionsDoc.exists()) {
        const data = sessionsDoc.data();
        console.log("✅ Sessions loaded from cloud");
        return data.sessions || [];
      }

      return [];
    } catch (error) {
      console.error("Error loading sessions:", error);
      throw error;
    }
  }

  /**
   * Merge local and cloud data (prefers most recent)
   */
  async mergeData(
    localShots: Shot[],
    localSessions: Session[],
  ): Promise<{ shots: Shot[]; sessions: Session[] }> {
    if (!this.isSyncEnabled()) {
      return { shots: localShots, sessions: localSessions };
    }

    try {
      const cloudShots = await this.loadShots();
      const cloudSessions = await this.loadSessions();

      // Simple merge: combine arrays and remove duplicates by id
      const mergedShots = this.mergeShotsArray(localShots, cloudShots);
      const mergedSessions = this.mergeSessionsArray(
        localSessions,
        cloudSessions,
      );

      // Sync merged data back to cloud
      await this.syncShots(mergedShots);
      await this.syncSessions(mergedSessions);

      return { shots: mergedShots, sessions: mergedSessions };
    } catch (error) {
      console.error("Error merging data:", error);
      return { shots: localShots, sessions: localSessions };
    }
  }

  private mergeShotsArray(local: Shot[], cloud: Shot[]): Shot[] {
    const shotMap = new Map<string, Shot>();

    // Add local shots
    local.forEach((shot) => {
      shotMap.set(shot.id, shot);
    });

    // Add/update with cloud shots
    cloud.forEach((shot) => {
      const existing = shotMap.get(shot.id);
      if (
        !existing ||
        new Date(shot.timestamp) > new Date(existing.timestamp)
      ) {
        shotMap.set(shot.id, shot);
      }
    });

    return Array.from(shotMap.values());
  }

  private mergeSessionsArray(local: Session[], cloud: Session[]): Session[] {
    const sessionMap = new Map<string, Session>();

    // Add local sessions
    local.forEach((session) => {
      sessionMap.set(session.id, session);
    });

    // Add/update with cloud sessions
    cloud.forEach((session) => {
      const existing = sessionMap.get(session.id);
      if (!existing || new Date(session.date) > new Date(existing.date)) {
        sessionMap.set(session.id, session);
      }
    });

    return Array.from(sessionMap.values());
  }

  /**
   * Delete all cloud data for current user
   */
  async deleteAllData(): Promise<void> {
    if (!this.isSyncEnabled() || !this.userId) {
      throw new Error("Cloud sync not enabled");
    }

    try {
      const shotsRef = doc(db, "users", this.userId, "data", "shots");
      const sessionsRef = doc(db, "users", this.userId, "data", "sessions");

      await Promise.all([deleteDoc(shotsRef), deleteDoc(sessionsRef)]);

      console.log("✅ All cloud data deleted");
    } catch (error) {
      console.error("Error deleting cloud data:", error);
      throw error;
    }
  }
}

export default CloudSyncManager.getInstance();
