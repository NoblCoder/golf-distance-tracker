/** @format */

export interface Shot {
  id: string;
  club: string;
  distance: number;
  shotType: string;
  timestamp: number;
  sessionId: string;
  gps?: {
    lat: number;
    lng: number;
  };
  dispersion?: {
    offline: number; // yards left (-) or right (+)
    short: number; // yards short (-) or long (+)
  };
}

export interface Session {
  id: string;
  name: string;
  date: number;
  location?: string;
}

export type Page = "home" | "history" | "charts" | "sessions" | "map";

export interface Filters {
  club?: string;
  shotType?: string;
  sessionId?: string;
  dateFrom?: number;
  dateTo?: number;
}
