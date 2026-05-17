/** @format */

import { Shot } from "../types";
import { format } from "date-fns";

export const exportToCSV = (
  shots: Shot[],
  filename: string = "golf-shots.csv",
) => {
  const headers = [
    "Date",
    "Club",
    "Distance (yds)",
    "Shot Type",
    "Session",
    "Course",
    "Hole",
    "Par",
    "Hole Yardage",
    "Hole Handicap",
    "GPS Lat",
    "GPS Lng",
    "Offline (yds)",
    "Short/Long (yds)",
  ];

  const rows = shots.map((shot) => [
    format(new Date(shot.timestamp), "yyyy-MM-dd HH:mm:ss"),
    shot.club,
    shot.distance.toString(),
    shot.shotType,
    shot.sessionId,
    shot.courseName || "",
    shot.holeNumber?.toString() || "",
    shot.holePar?.toString() || "",
    shot.holeYardage?.toString() || "",
    shot.holeHandicap?.toString() || "",
    shot.gps?.lat.toString() || "",
    shot.gps?.lng.toString() || "",
    shot.dispersion?.offline.toString() || "",
    shot.dispersion?.short.toString() || "",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
