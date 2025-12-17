"use client";

import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Bed,
  Sparkles,
  Home,
  ChevronRight,
  Phone,
  Calendar,
} from "lucide-react";
import ContactModal from "@/components/Contact";

interface RoomType {
  _id: string;
  type: string;
  pricePerMonth: number;
  capacity: string;
}

interface Amenity {
  _id: string;
  name: string;
  imageUrl: string;
}

export interface Property {
  _id: string;
  name: string;
  description: string;
  images: string[];
  amenities?: Amenity[];
  roomTypes: RoomType[];
  location: {
    city: string;
    area: string;
    address: string;
    latitude?: number;
    longitude?: number;
  };
}

/* =======================
   MAP
======================= */

const Mapbox = dynamic(
  () => import("./app/listing/sections/Mapbox"),
  { ssr: false }
);

export default function PgList({
  properties,
  loading,
  error,
}: {
  properties: Property[];
  loading: boolean;
  error: string | null;
}) {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

  const [hovered, setHovered] = useState<Property | null>(null);
  const [modalType, setModalType] = useState<null | "call" | "visit">(null);
  const [selectedProperty, setSelectedProperty] = useState<string>("");

  if (loading) return <div className="p-10">Loading…</div>;
  if (error) return <div className="p-10 text-red-500">{error}</div>;


  return (
    <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-80px)] bg-background">
      {/* LIST */}
      <section className="w-full lg:w-[65%] px-6 py-10 overflow-y-auto scrollbar-hide">
        <h3 className="text-2xl font-bold mb-6">
          {properties.length} PGs Nearby{" "}
          <span className="text-brand">
            {properties[0]?.location?.city || ""}
          </span>
        </h3>

        <div className="flex flex-col gap-6">
          {properties.map((pg) => {
            const startingPrice =
              pg.roomTypes.length > 0
                ? Math.min(...pg.roomTypes.map((r) => r.pricePerMonth))
                : 0;

            return (
              <div
                key={pg._id}
                onMouseEnter={() => setHovered(pg)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => router.push(`/listing/${pg._id}`)}
                className="group bg-card border rounded-2xl overflow-hidden cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row">

                  {/* IMAGE */}
                  <div className="relative w-full sm:w-1/3 h-48 sm:h-56">
                    <Image
                      src={`${API_URL}${pg.images?.[0]}`}
                      alt={pg.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <span className="absolute top-4 left-4 bg-emerald-500 text-white text-xs px-3 py-1 rounded-full flex gap-1">
                      <Sparkles className="w-3 h-3" />
                      Available
                    </span>
                  </div>

                  {/* CONTENT */}
                  <div className="w-full sm:w-2/3 p-4 sm:p-6 flex flex-col justify-between">
                    <div>
                      <h4 className="text-lg sm:text-xl font-bold">{pg.name}</h4>

                      <div className="flex gap-2 text-sm text-muted-foreground mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {pg.location.address}, {pg.location.area},{" "}
                          {pg.location.city}
                        </span>
                      </div>

                      {pg?.roomTypes?.length > 0 && (
                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                          {pg.roomTypes.map((room) => (
                            <div key={room._id} className="flex items-center gap-2">
                              <Bed className="w-4 h-4 text-teal-500" />
                              <span className="capitalize">{room.type}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* PRICE + ACTIONS */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 border-t mt-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Starting from
                        </p>
                        <p className="text-xl font-bold">
                          ₹{startingPrice.toLocaleString("en-IN")}
                          <span className="text-sm"> /month</span>
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProperty(pg._id);
                            setModalType("call");
                          }}
                          className="px-4 py-2 border rounded-lg flex gap-2"
                        >
                          <Phone className="w-4 h-4" />
                          Callback
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProperty(pg._id);
                            setModalType("visit");
                          }}
                          className="px-4 py-2 border rounded-lg flex gap-2"
                        >
                          <Calendar className="w-4 h-4" />
                          Visit
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            );
          })}
        </div>
      </section>

      {/* MAP */}
      <div className="w-full 
  h-[300px] sm:h-[350px] md:h-[400px]
  lg:h-auto lg:w-[35%]
  border-t lg:border-t-0 lg:border-l">
        <Mapbox locations={properties as any} hovered={hovered as any} />
      </div>


      <ContactModal
        open={modalType !== null}
        type={modalType as any}
        propertyId={selectedProperty}
        onClose={() => setModalType(null)}
      />
    </div>
  );
}
