import { NextResponse } from 'next/server';

export const runtime = 'edge';

// Helper to generate deterministic coordinates from string
// This ensures the same city always gets the same "random" coordinates
function getMockCoordinates(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Generate lat between -60 and 60
  const lat = (Math.abs(hash) % 120) - 60; 
  // Generate lng between -180 and 180
  const lng = (Math.abs(hash >> 16) % 360) - 180;
  return { lat, lng };
}

const majorCities = [
  { name: "Tokyo", country: "JP", lat: 35.6762, lng: 139.6503 },
  { name: "New York", country: "US", lat: 40.7128, lng: -74.0060 },
  { name: "London", country: "GB", lat: 51.5074, lng: -0.1278 },
  { name: "Paris", country: "FR", lat: 48.8566, lng: 2.3522 },
  { name: "Shanghai", country: "CN", lat: 31.2304, lng: 121.4737 },
  { name: "Beijing", country: "CN", lat: 39.9042, lng: 116.4074 },
  { name: "Los Angeles", country: "US", lat: 34.0522, lng: -118.2437 },
  { name: "Singapore", country: "SG", lat: 1.3521, lng: 103.8198 },
  { name: "Dubai", country: "AE", lat: 25.2048, lng: 55.2708 },
  { name: "Hong Kong", country: "HK", lat: 22.3193, lng: 114.1694 },
  { name: "Sydney", country: "AU", lat: -33.8688, lng: 151.2093 },
  { name: "Toronto", country: "CA", lat: 43.6532, lng: -79.3832 },
  { name: "Berlin", country: "DE", lat: 52.5200, lng: 13.4050 },
  { name: "Moscow", country: "RU", lat: 55.7558, lng: 37.6173 },
  { name: "Mumbai", country: "IN", lat: 19.0760, lng: 72.8777 },
  // ... Keep existing list but mapped with mock coords if needed
  { name: "Nadiad", country: "IN", lat: 22.6916, lng: 72.8634 }, 
  { name: "Delhi", country: "IN", lat: 28.6139, lng: 77.2090 },
  { name: "Bangalore", country: "IN", lat: 12.9716, lng: 77.5946 },
  // Add a generic fallback for the long list
];

// Extend the original list with mock coordinates for those missing them
// For this demo, we'll just return the ones above plus dynamic generation for query matches
// to simulate a full database.

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 1) {
      return NextResponse.json([]);
    }

    const lowercaseQuery = query.toLowerCase();

    // 1. Search in hardcoded majorCities
    let results = majorCities.filter(city => 
      city.name.toLowerCase().startsWith(lowercaseQuery)
    );

    // 2. Fallback: If no exact matches, generate a deterministic "World" entry
    // This ensures users can always select something and get valid (mock) coordinates
    if (results.length === 0 && query.length > 2) {
      const formattedName = query.charAt(0).toUpperCase() + query.slice(1);
      results.push({
        name: formattedName,
        country: "World",
        ...getMockCoordinates(formattedName)
      });
    }
    
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
