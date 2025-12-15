"use client";

import { useEffect, useState } from "react";
import PgList, { Property } from "@/components/pglist";
import PropertyFilters from "@/components/PropertyFilters";

interface Filters {
  city?: string;
  area?: string;
  gender?: string;
  roomType?: string;
  minPrice?: string;
  maxPrice?: string;
}

export default function ListingPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState<Filters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });

        const res = await fetch(
          `${API_URL}/api/properties?${params.toString()}`
        );

        if (!res.ok) throw new Error("Failed to fetch properties");

        const json = await res.json();
        setProperties(Array.isArray(json.data) ? json.data : []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filters, API_URL]);

  return (
    <div className="">
      <PropertyFilters onChange={setFilters} />

      <div className="mx-2 md:mx-26 lg:mx-48">
        <PgList
          properties={properties}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}
