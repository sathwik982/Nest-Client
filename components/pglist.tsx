"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const Mapbox = dynamic(() => import("./app/listing/sections/Mapbox"), {
  ssr: false,
});

interface RoomType {
  id: string;
  type: string;
  pricePerMonth: number;
}

interface Property {
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

export default function PgList() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [hovered, setHovered] = useState<Property | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get API URL with fallback
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Get query from URL
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("query") ?? "");
  }, []);

  // Fetch properties from backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = `${API_URL}/api/properties`;
        console.log("📡 Fetching from:", url);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("✅ API Response:", result);

        // Handle different response formats
        let propertiesArray: Property[] = [];

        if (Array.isArray(result)) {
          propertiesArray = result;
        } else if (result.data && Array.isArray(result.data)) {
          propertiesArray = result.data;
        } else if (result.properties && Array.isArray(result.properties)) {
          propertiesArray = result.properties;
        } else {
          console.error("❌ Unexpected response format:", result);
          setError("Unexpected data format from server");
          propertiesArray = [];
        }

        console.log("📊 Properties count:", propertiesArray.length);
        if (propertiesArray.length > 0) {
          console.log("🖼️ First property:", propertiesArray[0]);
          console.log(
            "🖼️ First property image:",
            propertiesArray[0].primaryImage
          );
        }
        setProperties(propertiesArray);
      } catch (err) {
        console.error("❌ Error fetching properties:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch properties"
        );
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [API_URL]);

  const queryLower = query?.toLowerCase() || "";

  const filtered = useMemo(() => {
    if (!Array.isArray(properties) || properties.length === 0) return [];
    if (!queryLower || !queryLower.trim()) return properties;

    const q = queryLower.trim().toLowerCase();

    const result = properties.filter((pg) => {
      const name = pg?.name?.toLowerCase() || "";
      const area = pg?.area?.toLowerCase() || "";
      const city = pg?.city?.toLowerCase() || "";

      return name.includes(q) || area.includes(q) || city.includes(q);
    });

    return result.length > 0 ? result : properties;
  }, [queryLower, properties]);

  if (loading) {
    return (
      <div className="flex w-full h-[calc(100vh-80px)] p-6 gap-6 bg-background">
        <div className="text-xl text-muted-foreground">
          Loading properties...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex w-full h-[calc(100vh-80px)] p-6 gap-6 bg-background">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-[calc(100vh-80px)] p-6 gap-6 bg-background">
      {/* LEFT: LIST */}
      <div className="w-[48%] h-full overflow-y-auto space-y-5 pr-1">
        <h1 className="text-2xl font-bold text-brand-gold mb-2">
          Results for:{" "}
          <span className="text-foreground font-semibold">
            {query || "All locations"}
          </span>
        </h1>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No properties found
          </div>
        ) : (
          filtered.map((pg) => {
            // ✅ CRITICAL FIX: Backend already returns full URLs (both external and local)
            // No need to prepend API_URL anymore!
            const imageUrl =
              pg.primaryImage ||
              "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800";

            return (
              <div
                key={pg._id || pg.id}
                onMouseEnter={() => setHovered(pg)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => router.push(`/listing/${pg._id || pg.id}`)}
                className="flex bg-card rounded-3xl shadow-md border border-border hover:border-brand-gold transition cursor-pointer overflow-hidden"
              >
                {/* IMAGE SIDE */}
                <div className="relative w-[40%] min-h-[220px] bg-muted flex items-center justify-center">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={pg.name || "Property"}
                      fill
                      className="object-cover"
                      unoptimized
                      onError={(e) => {
                        console.error("❌ Image failed to load:", imageUrl);
                        // Set fallback image
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800";
                      }}
                    />
                  ) : (
                    <div className="text-muted-foreground text-sm">
                      No Image
                    </div>
                  )}

                  <div className="absolute top-3 left-3 bg-brand-gold text-white text-[11px] px-3 py-1 rounded-md shadow z-10">
                    Preferred By Working Professionals
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-brand-gold text-white text-sm font-semibold py-2 px-4 flex items-center gap-2 z-10">
                    <span>👀</span>
                    <span>9 People Viewing Now</span>
                  </div>
                </div>

                {/* DETAILS SIDE */}
                <div className="w-[60%] px-6 py-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-brand-gold">
                        {pg.name || "Property Name"}
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        {pg.locationLabel || pg.area}
                      </p>
                    </div>

                    <div className="bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full shadow-sm border border-border">
                      {pg.genderLabel || "Unisex"}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {pg.amenitiesLabels && pg.amenitiesLabels.length > 0 ? (
                      pg.amenitiesLabels.slice(0, 2).map((amenity, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-accent text-brand-gold text-xs rounded-full border border-border"
                        >
                          {amenity}
                        </span>
                      ))
                    ) : (
                      <span className="px-3 py-1 bg-accent text-brand-gold text-xs rounded-full border border-border">
                        Attached Washroom
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {pg.roomTypes && pg.roomTypes.length > 0 ? (
                      pg.roomTypes.map((rt) => (
                        <span
                          key={rt.id}
                          className="flex items-center gap-1 px-3 py-1 border border-border rounded-full text-xs text-foreground"
                        >
                          🛏️{" "}
                          {rt.type?.charAt(0).toUpperCase() + rt.type?.slice(1)}
                        </span>
                      ))
                    ) : (
                      <span className="flex items-center gap-1 px-3 py-1 border border-border rounded-full text-xs text-foreground">
                        🛏️ Single
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Starts from
                      </p>
                      <p className="text-lg font-bold text-brand-gold">
                        ₹{(pg.startingPrice || 0).toLocaleString("en-IN")}
                        <span className="text-sm font-medium text-muted-foreground">
                          /mo*
                        </span>
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="px-5 py-2 bg-brand-gold text-white text-sm font-semibold rounded-lg hover:bg-brand-gold-dark transition"
                      >
                        SCHEDULE A VISIT
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="px-5 py-2 bg-background border border-brand-gold text-brand-gold text-sm font-semibold rounded-lg hover:bg-accent transition"
                      >
                        REQUEST A CALLBACK
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-brand-gold cursor-pointer hover:underline">
                    📍 View Directions
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* RIGHT: MAP */}
      <div className="w-[52%] h-full rounded-3xl overflow-hidden shadow-xl border border-border bg-card">
        <Mapbox locations={filtered} hovered={hovered} />
      </div>
    </div>
  );
}
