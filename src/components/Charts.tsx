/** @format */

import React from "react";
import { Shot } from "../types";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ChartsProps {
  shots: Shot[];
}

const COLORS = [
  "#ffcb2f",
  "#4bb3fd",
  "#7ed957",
  "#ff6b6b",
  "#9b59b6",
  "#f39c12",
];

export default function Charts({ shots }: ChartsProps) {
  // Calculate average distance per club
  const clubData = shots.reduce((acc: any, shot) => {
    if (!acc[shot.club]) {
      acc[shot.club] = { club: shot.club, distances: [], count: 0 };
    }
    acc[shot.club].distances.push(shot.distance);
    acc[shot.club].count++;
    return acc;
  }, {});

  const averageData = Object.values(clubData).map((data: any) => ({
    club: data.club,
    avg: (
      data.distances.reduce((a: number, b: number) => a + b, 0) / data.count
    ).toFixed(1),
    count: data.count,
  }));

  // Distance distribution data
  const distanceRanges = [
    { range: "0-100", min: 0, max: 100, count: 0 },
    { range: "100-150", min: 100, max: 150, count: 0 },
    { range: "150-200", min: 150, max: 200, count: 0 },
    { range: "200-250", min: 200, max: 250, count: 0 },
    { range: "250+", min: 250, max: Infinity, count: 0 },
  ];

  shots.forEach((shot) => {
    const range = distanceRanges.find(
      (r) => shot.distance >= r.min && shot.distance < r.max,
    );
    if (range) range.count++;
  });

  // Dispersion data for scatter plot
  const dispersionData = shots
    .filter((shot) => shot.dispersion)
    .map((shot) => ({
      x: shot.dispersion!.offline,
      y: shot.dispersion!.short,
      club: shot.club,
      distance: shot.distance,
    }));

  return (
    <div className='charts-container'>
      <h2>📈 Analytics</h2>

      <div className='chart-section'>
        <h3>Average Distance by Club</h3>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={averageData}>
            <CartesianGrid
              strokeDasharray='3 3'
              stroke='rgba(255,255,255,0.2)'
            />
            <XAxis dataKey='club' stroke='#fff' />
            <YAxis stroke='#fff' />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.8)",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey='avg' name='Avg Distance (yds)' fill='#ffcb2f'>
              {averageData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className='chart-section'>
        <h3>Distance Distribution</h3>
        <ResponsiveContainer width='100%' height={250}>
          <BarChart data={distanceRanges}>
            <CartesianGrid
              strokeDasharray='3 3'
              stroke='rgba(255,255,255,0.2)'
            />
            <XAxis dataKey='range' stroke='#fff' />
            <YAxis stroke='#fff' />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.8)",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey='count' name='Shots' fill='#4bb3fd' />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {dispersionData.length > 0 && (
        <div className='chart-section'>
          <h3>Shot Dispersion</h3>
          <ResponsiveContainer width='100%' height={300}>
            <ScatterChart>
              <CartesianGrid
                strokeDasharray='3 3'
                stroke='rgba(255,255,255,0.2)'
              />
              <XAxis
                type='number'
                dataKey='x'
                name='Offline'
                unit=' yds'
                stroke='#fff'
                label={{
                  value: "Left ← → Right",
                  position: "bottom",
                  fill: "#fff",
                }}
              />
              <YAxis
                type='number'
                dataKey='y'
                name='Short/Long'
                unit=' yds'
                stroke='#fff'
                label={{
                  value: "Short ← → Long",
                  angle: -90,
                  position: "left",
                  fill: "#fff",
                }}
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: "8px",
                }}
              />
              <Scatter data={dispersionData} fill='#7ed957' />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}

      {shots.length === 0 && (
        <p className='empty-state'>
          No data yet. Start adding shots to see charts!
        </p>
      )}
    </div>
  );
}
