"use client";

import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import Image from "next/image";

// default marker icon files must be in /public/leaflet
const defaultIcon = new L.Icon({
    iconUrl: "/ic_location.png", // 👈 your custom icon
    iconSize: [42, 42],          // adjust size as needed
    iconAnchor: [21, 42],        // center-bottom point of pin
    popupAnchor: [0, -40],       // where popup should appear
});


function MapEffects({ hovered, locations }) {
    const map = useMap();

    // fix layout when map is inside flex container
    useEffect(() => {
        map.invalidateSize();
    }, [map]);

    // fly to hovered PG or fit bounds
    useEffect(() => {
        if (hovered && hovered.latitude && hovered.longitude) {
            map.flyTo([hovered.latitude, hovered.longitude], 15, { duration: 0.6 });
        } else if (locations.length > 0) {
            const bounds = L.latLngBounds(
                locations
                    .filter((l) => l.latitude && l.longitude)
                    .map((l) => [l.latitude, l.longitude])
            );
            if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [40, 40] });
            }
        }
    }, [hovered, locations, map]);

    return null;
}

export default function Mapbox({ locations = [], hovered = null }) {
    const fallbackCenter = [12.9716, 77.5946]; // Bengaluru fallback
    const firstWithCoords = locations.find((l) => l.latitude && l.longitude);
    const center = firstWithCoords
        ? [firstWithCoords.latitude, firstWithCoords.longitude]
        : fallbackCenter;

    return (
        <div className="relative w-full h-full">
            <MapContainer
                center={center}
                zoom={13}
                scrollWheelZoom={false}
                className="w-full h-full"
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <MapEffects hovered={hovered} locations={locations} />

                {locations
                    .filter((l) => l.latitude && l.longitude)
                    .map((loc) => (
                        <Marker
                            key={loc.id}
                            position={[loc.latitude, loc.longitude]}
                            icon={defaultIcon}
                        />
                    ))}
            </MapContainer>

            {/* INFO WINDOW LIKE STANZA */}
            {hovered && (
                <div className="pointer-events-none absolute z-[500] left-1/2 top-10 -translate-x-1/2">
                    <div className="relative">
                        <div className="bg-white rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.18)] px-4 py-3 flex items-center gap-3 min-w-[260px]">
                            <div className="relative w-14 h-14 rounded-md overflow-hidden flex-shrink-0">
                                {hovered.primaryImage && (
                                    <Image
                                        src={hovered.primaryImage}
                                        alt={hovered.name}
                                        fill
                                        className="object-cover"
                                    />
                                )}
                            </div>

                            <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#1d1e1d]">
                  {hovered.name}
                </span>
                                <span className="text-[11px] text-gray-500">
                  {hovered.locationLabel}
                </span>
                                <span className="text-[11px] text-gray-500 mt-1">
                  Starts from :
                </span>
                                <span className="text-[13px] font-semibold text-[#11a26a]">
                  ₹{hovered.startingPrice.toLocaleString("en-IN")}{" "}
                                    <span className="text-[11px] font-medium text-[#11a26a]">
                    / month*
                  </span>
                </span>
                            </div>
                        </div>

                        {/* little diamond tail */}
                        <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 shadow-[0_10px_25px_rgba(0,0,0,0.12)]" />
                    </div>
                </div>
            )}
        </div>
    );
}
