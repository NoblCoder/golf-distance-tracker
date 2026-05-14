/** @format */

import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvents,
  LayersControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { searchGolfCourses, GeocodingResult } from "../utils/geocoding";
import { calculateDistance } from "../utils/gpsHelper";

// Fix Leaflet default marker icon issue
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom red marker for target
const targetIcon = L.icon({
  iconUrl:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 36'%3E%3Cpath fill='%23dc2626' d='M12 0C5.4 0 0 5.4 0 12c0 8 12 24 12 24s12-16 12-24c0-6.6-5.4-12-12-12zm0 16c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z'/%3E%3C/svg%3E",
  shadowUrl: iconShadow,
  iconSize: [30, 45],
  iconAnchor: [15, 45],
});

const mapContainerStyle = {
  width: "100%",
  height: "550px",
  borderRadius: "8px",
};

const defaultCenter: [number, number] = [40.7128, -74.006]; // New York

// Component to handle map clicks for setting target
function MapClickHandler({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function RangeFinder() {
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [targetLocation, setTargetLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // Get initial location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Unable to get your location. Please enable location services.",
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      );
    }
  }, []);

  // Real-time location tracking
  useEffect(() => {
    if (isTracking && navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error tracking location:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      );

      return () => {
        if (watchIdRef.current !== null) {
          navigator.geolocation.clearWatch(watchIdRef.current);
        }
      };
    }
  }, [isTracking]);

  // Calculate distance when locations change
  useEffect(() => {
    if (currentLocation && targetLocation) {
      const dist = calculateDistance(
        currentLocation.lat,
        currentLocation.lng,
        targetLocation.lat,
        targetLocation.lng,
      );
      setDistance(dist);
    } else {
      setDistance(null);
    }
  }, [currentLocation, targetLocation]);

  const handleMapClick = (lat: number, lng: number) => {
    setTargetLocation({ lat, lng });
    setSearchQuery("");
  };

  const handleSearch = async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    const results = await searchGolfCourses(query);
    setSearchResults(results);
    setShowResults(results.length > 0);
    setIsSearching(false);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(query);
    }, 500);
  };

  const handleLocationSelect = (result: GeocodingResult) => {
    setTargetLocation({ lat: result.lat, lng: result.lng });
    setSearchQuery(result.name);
    setShowResults(false);
  };

  const clearTarget = () => {
    setTargetLocation(null);
    setSearchQuery("");
    setDistance(null);
  };

  const mapCenter: [number, number] = currentLocation
    ? [currentLocation.lat, currentLocation.lng]
    : defaultCenter;

  return (
    <div className='range-finder-container'>
      <h2>📏 Range Finder</h2>
      <p className='range-finder-description'>
        Tap on the map or search for a location to measure the distance from
        your current position.
      </p>

      {/* Controls */}
      <div className='range-finder-controls'>
        <div className='search-location-wrapper'>
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => searchQuery.length >= 3 && setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            placeholder='Search for a target location...'
            className='location-search-input'
          />
          {isSearching && <span className='search-loader'>🔍</span>}
          {showResults && searchResults.length > 0 && (
            <div className='search-results'>
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className='search-result-item'
                  onClick={() => handleLocationSelect(result)}
                  onMouseDown={(e) => e.preventDefault()}>
                  <div className='result-name'>📍 {result.name}</div>
                  <div className='result-address'>{result.displayName}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='tracking-controls'>
          <button
            className={`tracking-btn ${isTracking ? "active" : ""}`}
            onClick={() => setIsTracking(!isTracking)}
            title={isTracking ? "Stop live tracking" : "Start live tracking"}>
            {isTracking ? "📍 Live Tracking On" : "📍 Start Live Tracking"}
          </button>
          {targetLocation && (
            <button
              className='clear-target-btn'
              onClick={clearTarget}
              title='Clear target'>
              ✕ Clear Target
            </button>
          )}
        </div>
      </div>

      {/* Distance Display */}
      {distance !== null && (
        <div className='distance-display'>
          <div className='distance-value'>{Math.round(distance)}</div>
          <div className='distance-unit'>yards</div>
          {currentLocation && targetLocation && (
            <div className='distance-details'>
              <small>
                From: {currentLocation.lat.toFixed(5)},{" "}
                {currentLocation.lng.toFixed(5)}
              </small>
              <br />
              <small>
                To: {targetLocation.lat.toFixed(5)},{" "}
                {targetLocation.lng.toFixed(5)}
              </small>
            </div>
          )}
        </div>
      )}

      {/* Map */}
      {currentLocation ? (
        <div className='range-finder-map'>
          <MapContainer
            center={mapCenter}
            zoom={16}
            style={mapContainerStyle}
            scrollWheelZoom={true}>
            <MapClickHandler onLocationSelect={handleMapClick} />

            <LayersControl position='topright'>
              <LayersControl.BaseLayer name='Street Map'>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer checked name='Satellite View'>
                <TileLayer
                  attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                  url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                  maxZoom={19}
                />
              </LayersControl.BaseLayer>
            </LayersControl>

            {/* Current location marker */}
            <Marker position={[currentLocation.lat, currentLocation.lng]}>
              <Popup>
                <div className='map-popup'>
                  <h4>📍 Your Location</h4>
                  <p>
                    {currentLocation.lat.toFixed(5)},{" "}
                    {currentLocation.lng.toFixed(5)}
                  </p>
                  {isTracking && (
                    <p className='tracking-status'>🔄 Live tracking active</p>
                  )}
                </div>
              </Popup>
            </Marker>

            {/* Target marker */}
            {targetLocation && (
              <Marker
                position={[targetLocation.lat, targetLocation.lng]}
                icon={targetIcon}>
                <Popup>
                  <div className='map-popup'>
                    <h4>🎯 Target</h4>
                    <p>
                      {targetLocation.lat.toFixed(5)},{" "}
                      {targetLocation.lng.toFixed(5)}
                    </p>
                    {distance && (
                      <p className='popup-distance'>
                        <strong>{Math.round(distance)} yards</strong>
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Line connecting current location to target */}
            {currentLocation && targetLocation && (
              <Polyline
                positions={[
                  [currentLocation.lat, currentLocation.lng],
                  [targetLocation.lat, targetLocation.lng],
                ]}
                pathOptions={{
                  color: "#dc2626",
                  weight: 3,
                  opacity: 0.7,
                  dashArray: "10, 10",
                }}
              />
            )}
          </MapContainer>
        </div>
      ) : (
        <div className='loading-location'>
          <p>📍 Getting your location...</p>
          <p className='loading-hint'>
            Please ensure location services are enabled
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className='range-finder-instructions'>
        <h3>How to use:</h3>
        <ul>
          <li>🗺️ Tap anywhere on the map to set a target point</li>
          <li>🔍 Or search for a specific location (golf course, landmark)</li>
          <li>
            📍 Enable live tracking for real-time distance updates as you move
          </li>
          <li>📏 Distance is calculated in yards</li>
        </ul>
      </div>
    </div>
  );
}
