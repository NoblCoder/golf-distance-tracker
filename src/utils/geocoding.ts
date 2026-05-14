/** @format */

export interface GeocodingResult {
  name: string;
  displayName: string;
  lat: number;
  lng: number;
  type: string;
}

/**
 * Search for golf courses using Nominatim (OpenStreetMap) geocoding API
 * @param query - Search query (golf course name or location)
 * @returns Array of golf course results
 */
export async function searchGolfCourses(
  query: string,
): Promise<GeocodingResult[]> {
  if (!query || query.length < 3) {
    return [];
  }

  try {
    // Use Nominatim API to search for golf courses
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
        new URLSearchParams({
          q: `${query} golf course`,
          format: "json",
          limit: "5",
          addressdetails: "1",
        }),
      {
        headers: {
          "User-Agent": "GolfDistanceTracker/1.0",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Geocoding request failed");
    }

    const data = await response.json();

    return data.map((item: any) => ({
      name: item.name || item.display_name.split(",")[0],
      displayName: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      type: item.type,
    }));
  } catch (error) {
    console.error("Error searching golf courses:", error);
    return [];
  }
}

/**
 * Get the location of a specific address or place
 * @param address - Address or place name to geocode
 * @returns Location coordinates or null if not found
 */
export async function geocodeAddress(
  address: string,
): Promise<{ lat: number; lng: number } | null> {
  if (!address || address.length < 3) {
    return null;
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
        new URLSearchParams({
          q: address,
          format: "json",
          limit: "1",
        }),
      {
        headers: {
          "User-Agent": "GolfDistanceTracker/1.0",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Geocoding request failed");
    }

    const data = await response.json();

    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }

    return null;
  } catch (error) {
    console.error("Error geocoding address:", error);
    return null;
  }
}
