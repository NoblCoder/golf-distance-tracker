/** @format */

import React, { useState, useMemo, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  LayersControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Shot } from "../types";

// Fix Leaflet default marker icon issue
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  shots: Shot[];
}

const mapContainerStyle = {
  width: "100%",
  height: "500px",
  borderRadius: "8px",
};

const defaultCenter: [number, number] = [40.7128, -74.006]; // New York

// Helper function to get marker color
const getMarkerColor = (shotType: string) => {
  switch (shotType) {
    case "good":
      return "#4caf50";
    case "bad":
      return "#f44336";
    default:
      return "#2196f3";
  }
};

export default function Map({ shots }: MapProps) {
  const shotsWithGPS = shots.filter((shot) => shot.gps);
  const [courseName, setCourseName] = useState<string>(
    localStorage.getItem("currentCourse") || "",
  );
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Get user's current location for course context
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Could not get location:", error);
        },
      );
    }
  }, []);

  const handleCourseChange = (newCourse: string) => {
    setCourseName(newCourse);
    localStorage.setItem("currentCourse", newCourse);
  };

  // Calculate center of all GPS points
  const center: [number, number] = useMemo(() => {
    if (shotsWithGPS.length === 0) return defaultCenter;

    const avgLat =
      shotsWithGPS.reduce((sum, shot) => sum + shot.gps!.lat, 0) /
      shotsWithGPS.length;
    const avgLng =
      shotsWithGPS.reduce((sum, shot) => sum + shot.gps!.lng, 0) /
      shotsWithGPS.length;

    return [avgLat, avgLng];
  }, [shotsWithGPS]);

  return (
    <div className='map-container'>
      <h2>🗺️ GPS Shot Mapping</h2>

      {/* Course Selector */}
      <div className='course-selector'>
        <label htmlFor='course-name'>
          <span className='course-label'>⛳ Golf Course:</span>
          <input
            id='course-name'
            type='text'
            value={courseName}
            onChange={(e) => handleCourseChange(e.target.value)}
            placeholder='Enter course name...'
            className='course-input'
          />
        </label>
        {userLocation && (
          <p className='location-info'>
            📍 Your location: {userLocation.lat.toFixed(4)},{" "}
            {userLocation.lng.toFixed(4)}
          </p>
        )}
      </div>

      {shotsWithGPS.length === 0 ? (
        <div className='empty-state'>
          <p>No GPS data available yet.</p>
          <p>Add shots to see them on the map!</p>
        </div>
      ) : (
        <div className='map-content'>
          <MapContainer
            center={center}
            zoom={15}
            style={mapContainerStyle}
            scrollWheelZoom={true}>
            <LayersControl position='topright'>
              <LayersControl.BaseLayer checked name='Street Map'>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name='Satellite View'>
                <TileLayer
                  attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                  url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                  maxZoom={19}
                />
              </LayersControl.BaseLayer>
            </LayersControl>

            {/* User's current location marker */}
            {userLocation && (
              <Marker position={[userLocation.lat, userLocation.lng]}>
                <Popup>
                  <div className='map-popup'>
                    <h4>📍 Your Location</h4>
                    {courseName && <p>At: {courseName}</p>}
                    <p className='shot-timestamp'>Current position</p>
                  </div>
                </Popup>
              </Marker>
            )}

            {shotsWithGPS.map((shot) => (
              <CircleMarker
                key={shot.id}
                center={[shot.gps!.lat, shot.gps!.lng]}
                radius={10}
                pathOptions={{
                  fillColor: getMarkerColor(shot.shotType),
                  fillOpacity: 0.8,
                  color: "#ffffff",
                  weight: 2,
                }}>
                <Popup>
                  <div className='map-popup'>
                    <h4>{shot.club}</h4>
                    <p>
                      <strong>Distance:</strong> {shot.distance} yards
                    </p>
                    <p>
                      <strong>Type:</strong> {shot.shotType}
                    </p>
                    {shot.dispersion && (
                      <p>
                        <strong>Dispersion:</strong> {shot.dispersion.offline}{" "}
                        yds offline, {shot.dispersion.short} yds{" "}
                        {shot.dispersion.short > 0 ? "short" : "long"}
                      </p>
                    )}
                    <p className='shot-timestamp'>
                      {new Date(shot.timestamp).toLocaleString()}
                    </p>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>

          <div className='map-stats'>
            <p>📍 Showing {shotsWithGPS.length} shots with GPS data</p>
            <div className='map-legend'>
              <span>
                <span className='legend-marker good'></span> Good shots
              </span>
              <span>
                <span className='legend-marker bad'></span> Bad shots
              </span>
              <span>
                <span className='legend-marker ok'></span> OK shots
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
