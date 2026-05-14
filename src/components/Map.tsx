/** @format */

import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  LayersControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Shot } from "../types";
import { searchGolfCourses, GeocodingResult } from "../utils/geocoding";

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

// Component to handle map center changes
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, 15, {
      duration: 1.5,
    });
  }, [center, map]);

  return null;
}

export default function Map({ shots }: MapProps) {
  const shotsWithGPS = shots.filter((shot) => shot.gps);
  const [courseName, setCourseName] = useState<string>(
    localStorage.getItem("currentCourse") || "",
  );
  const [courseLocation, setCourseLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(() => {
    const saved = localStorage.getItem("currentCourseLocation");
    return saved ? JSON.parse(saved) : null;
  });
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Debounced search function
  const handleCourseSearch = useCallback(async (query: string) => {
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
  }, []);

  const handleCourseChange = (newCourse: string) => {
    setCourseName(newCourse);

    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce the search
    searchTimeoutRef.current = setTimeout(() => {
      handleCourseSearch(newCourse);
    }, 500);
  };

  const handleCourseSelect = (result: GeocodingResult) => {
    setCourseName(result.name);
    setCourseLocation({ lat: result.lat, lng: result.lng });
    setShowResults(false);

    // Save to localStorage
    localStorage.setItem("currentCourse", result.name);
    localStorage.setItem(
      "currentCourseLocation",
      JSON.stringify({ lat: result.lat, lng: result.lng }),
    );
  };

  // Calculate center of all GPS points or use course location
  const center: [number, number] = useMemo(() => {
    // If a course is selected, use that location
    if (courseLocation) {
      return [courseLocation.lat, courseLocation.lng];
    }

    // Otherwise, if there are shots with GPS, center on them
    if (shotsWithGPS.length === 0) return defaultCenter;

    const avgLat =
      shotsWithGPS.reduce((sum, shot) => sum + shot.gps!.lat, 0) /
      shotsWithGPS.length;
    const avgLng =
      shotsWithGPS.reduce((sum, shot) => sum + shot.gps!.lng, 0) /
      shotsWithGPS.length;

    return [avgLat, avgLng];
  }, [shotsWithGPS, courseLocation]);

  return (
    <div className='map-container'>
      <h2>🗺️ GPS Shot Mapping</h2>

      {/* Course Selector */}
      <div className='course-selector'>
        <label htmlFor='course-name'>
          <span className='course-label'>⛳ Golf Course:</span>
          <div className='course-search-wrapper'>
            <input
              id='course-name'
              type='text'
              value={courseName}
              onChange={(e) => handleCourseChange(e.target.value)}
              onFocus={() => courseName.length >= 3 && setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              placeholder='Search for a golf course...'
              className='course-input'
            />
            {isSearching && <span className='search-loader'>🔍</span>}
            {showResults && searchResults.length > 0 && (
              <div className='search-results'>
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className='search-result-item'
                    onClick={() => handleCourseSelect(result)}
                    onMouseDown={(e) => e.preventDefault()}>
                    <div className='result-name'>⛳ {result.name}</div>
                    <div className='result-address'>{result.displayName}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </label>
        {courseLocation && (
          <button
            className='clear-course-btn'
            onClick={() => {
              setCourseLocation(null);
              setCourseName("");
              localStorage.removeItem("currentCourse");
              localStorage.removeItem("currentCourseLocation");
            }}
            title='Clear selected course'>
            ✕ Clear Course
          </button>
        )}
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
            <MapController center={center} />
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

            {/* Selected course marker */}
            {courseLocation && (
              <Marker position={[courseLocation.lat, courseLocation.lng]}>
                <Popup>
                  <div className='map-popup'>
                    <h4>⛳ {courseName}</h4>
                    <p className='shot-timestamp'>Selected Golf Course</p>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* User's current location marker */}
            {userLocation && (
              <Marker position={[userLocation.lat, userLocation.lng]}>
                <Popup>
                  <div className='map-popup'>
                    <h4>📍 Your Location</h4>
                    {courseName && !courseLocation && <p>At: {courseName}</p>}
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
