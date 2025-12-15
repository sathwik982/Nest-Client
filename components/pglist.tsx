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

/* =======================
   TYPES
======================= */

interface RoomType {
  _id: string;
  type: string;
  pricePerMonth: number;
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
    <div className="flex w-full h-[calc(100vh-80px)] bg-background">
      {/* LIST */}
      <section className="w-full lg:w-[65%] px-6 py-10 overflow-y-auto">
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
                <div className="flex">
                  <div className="relative w-1/3 h-64">
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

                  <div className="w-2/3 p-6">
                    <h4 className="text-xl font-bold">{pg.name}</h4>

                    <div className="flex gap-2 text-sm text-muted-foreground mt-1">
                      <MapPin className="w-4 h-4" />
                      {pg.location.address}, {pg.location.area},{" "}
                      {pg.location.city}
                    </div>

                    


                    <div className="flex justify-between items-center pt-4 border-t mt-4">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Starting from
                        </p>
                        <p className="text-xl font-bold">
                          ₹{startingPrice.toLocaleString("en-IN")}
                          <span className="text-sm"> /month</span>
                        </p>
                      </div>

                      <div className="flex gap-3">
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
      <div className="hidden lg:block lg:w-[35%] border-l">
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
