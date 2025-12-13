// lib/api.ts - API helper functions

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface RoomType {
  id: string;
  type: string;
  price: number;
  deposit: number;
  available: boolean;
}

export interface Property {
  _id?: string;
  id?: string;
  name: string;
  area: string;
  city: string;
  locationLabel?: string;
  genderLabel?: string;
  primaryImage: string;
  images?: string[];
  amenitiesLabels?: string[];
  roomTypes?: RoomType[];
  startingPrice?: number;
  latitude?: number;
  longitude?: number;
}

// Fetch all properties with optional search query
export async function getAllProperties(query?: string): Promise<Property[]> {
  try {
    const url = query 
      ? `${API_URL}/api/properties?search=${encodeURIComponent(query)}`
      : `${API_URL}/api/properties`;
    
    console.log('Fetching from:', url); // Debug log
    
    const response = await fetch(url, {
      cache: 'no-store', // Disable caching for fresh data
    });

    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    console.log('Received properties:', data.length); // Debug log
    return data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

// Fetch a single property by ID
export async function getPropertyById(id: string): Promise<Property | null> {
  try {
    const url = `${API_URL}/api/properties/${id}`;
    console.log('Fetching property from:', url); // Debug log
    
    const response = await fetch(url, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('API Error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
}

// Helper to get full image URL
export function getImageUrl(imagePath: string): string {
  if (!imagePath) return '/placeholder.png';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Otherwise, prepend the API URL
  return `${API_URL}${imagePath}`;
}