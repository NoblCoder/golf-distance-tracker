/** @format */

export interface Shot {
  id: string;
  club: string;
  distance: number;
  shotType: string;
  timestamp: number;
  sessionId: string;
  courseName?: string;
  holeNumber?: number;
  holePar?: number;
  holeYardage?: number;
  holeHandicap?: number;
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

export interface SavedHole {
  courseName: string;
  holeNumber: number;
  par?: number;
  yardage?: number;
  handicap?: number;
}

export type Page =
  | "home"
  | "history"
  | "charts"
  | "sessions"
  | "map"
  | "rangefinder"
  | "settings";

export interface Filters {
  club?: string;
  shotType?: string;
  sessionId?: string;
  courseName?: string;
  holeNumber?: number;
  dateFrom?: number;
  dateTo?: number;
}
