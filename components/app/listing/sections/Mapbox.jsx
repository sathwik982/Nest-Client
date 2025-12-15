"use client";

import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useMemo } from "react";
import "leaflet/dist/leaflet.css";
import Image from "next/image";

// Custom marker icon
const defaultIcon = new L.Icon({
  iconUrl: "/ic_location.png",
  iconSize: [42, 42],
  iconAnchor: [21, 42],
  popupAnchor: [0, -40],
});

function MapEffects({ hovered, locations }) {
  const map = useMap();

  // Fix map sizing inside flex
  useEffect(() => {
    map.invalidateSize();
  }, [map]);

  // Fly to hovered location
  useEffect(() => {
    if (
      hovered?.location?.latitude &&
      hovered?.location?.longitude
    ) {
      map.flyTo(
        [hovered.location.latitude, hovered.location.longitude],
        15,
        { duration: 0.6 }
      );
    } else if (locations.length > 0) {
      const bounds = L.latLngBounds(
        locations
          .filter(
            (l) =>
              l.location?.latitude &&
              l.location?.longitude
          )
          .map((l) => [
            l.location.latitude,
            l.location.longitude,
          ])
      );

      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    }
  }, [hovered, locations, map]);

  return null;
}

export default function Mapbox({ locations = [], hovered = null }) {
  const fallbackCenter = [12.9716, 77.5946]; // Bengaluru

  const firstWithCoords = locations.find(
    (l) => l.location?.latitude && l.location?.longitude
  );

  const center = firstWithCoords
    ? [
        firstWithCoords.location.latitude,
        firstWithCoords.location.longitude,
      ]
    : fallbackCenter;

  // ✅ SAFE starting price
  const startingPrice = useMemo(() => {
    if (!hovered?.roomTypes?.length) return 0;
    return Math.min(
      ...hovered.roomTypes.map((r) => r.pricePerMonth)
    );
  }, [hovered]);

  const previewImage =
    hovered?.images?.[0] ||
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300";

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  attribution="&copy; OpenStreetMap contributors"
/>


        <MapEffects hovered={hovered} locations={locations} />

        {locations
          .filter(
            (l) =>
              l.location?.latitude &&
              l.location?.longitude
          )
          .map((loc) => (
            <Marker
              key={loc._id}
              position={[
                loc.location.latitude,
                loc.location.longitude,
              ]}
              icon={defaultIcon}
            />
          ))}
      </MapContainer>

      {/* INFO CARD */}
      {hovered && (
        <div className="pointer-events-none absolute z-[500] left-1/2 top-10 -translate-x-1/2">
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.18)] px-4 py-3 flex items-center gap-3 min-w-[260px]">

              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#1d1e1d]">
                  {hovered.name}
                </span>

                <span className="text-[11px] text-gray-500">
                  {hovered.location.area},{" "}
                  {hovered.location.city}
                </span>

                <span className="text-[11px] text-gray-500 mt-1">
                  Starts from:
                </span>

                <span className="text-[13px] font-semibold text-[#11a26a]">
                  ₹{startingPrice.toLocaleString("en-IN")}
                  <span className="text-[11px] font-medium text-[#11a26a]">
                    {" "}
                    / month*
                  </span>
                </span>
              </div>
            </div>

            {/* tail */}
            <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 shadow-[0_10px_25px_rgba(0,0,0,0.12)]" />
          </div>
        </div>
      )}
    </div>
  );
}
