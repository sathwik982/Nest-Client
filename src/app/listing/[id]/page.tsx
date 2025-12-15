"use client";

import React from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

interface RoomType {
  id: string;
  type: string;
  capacity: number;
  pricePerMonth: number;
}

interface FoodMenu {
  day: string;
  breakfast?: string;
  lunch?: string;
  dinner?: string;
}

interface Service {
  _id: string;
  name: string;
  imageUrl: string;
}

interface Amenities {
  _id: string;
  name: string;
  imageUrl: string;
}

interface Property {
  _id?: string;
  id?: string;
  name: string;
  area: string;
  city: string;
  address: string;
  location: {
    city: string;
    area: string;
    address: string;
    latitude?: number;
    longitude?: number;
  };
  gender?: string;
  primaryImage: string;
  images: string[];
  startingPrice: number;
  latitude?: number;
  longitude?: number;
  description?: string;
  amenities?: Amenities[];
  services?: Service[];
  roomTypes?: RoomType[];
  foodMenu?: FoodMenu[];
}

type TabKey = "occupancy" | "amenities" | "details";
type FormMode = "visit" | "reserve";

export default function PgDetailsPage() {
  const params = useParams<{ id: string }>();
  const [pg, setPg] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<TabKey>("occupancy");
  const [formMode, setFormMode] = useState<FormMode>("visit");
  const [showMore, setShowMore] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const contactMessage =
    formMode === "visit"
      ? "I want to schedule a visit for this PG"
      : "I want to reserve this PG. Please contact me";



  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // ✅ FETCH REAL DATA FROM BACKEND
  useEffect(() => {
    const fetchProperty = async () => {
      if (!params?.id) return;

      setLoading(true);
      try {
        const url = `${API_URL}/api/properties/${params.id}`;
        console.log("📡 Fetching property from:", url);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("✅ Property data:", result);

        // Handle different response formats
        const propertyData = result.data || result;

        if (propertyData) {
          setPg(propertyData);
          console.log("🖼️ Images array:", propertyData.images);
          console.log("🖼️ Primary image:", propertyData.primaryImage);
        }
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [params?.id, API_URL]);

  const nextImage = () => {
    if (!pg || !pg.images || pg.images.length === 0) return;
    setCurrentImageIndex((prev) =>
      prev === pg.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!pg || !pg.images || pg.images.length === 0) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? pg.images.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    const handleScroll = () => {
      const occupancyEl = document.getElementById("occupancy");
      const amenitiesEl = document.getElementById("amenities");
      const detailsEl = document.getElementById("details");

      if (!occupancyEl || !amenitiesEl || !detailsEl) return;

      const scrollY = window.scrollY + 200;
      const occupancyTop = occupancyEl.offsetTop;
      const amenitiesTop = amenitiesEl.offsetTop;
      const detailsTop = detailsEl.offsetTop;

      if (scrollY >= detailsTop) {
        setActiveTab("details");
      } else if (scrollY >= amenitiesTop) {
        setActiveTab("amenities");
      } else if (scrollY >= occupancyTop) {
        setActiveTab("occupancy");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleContactSubmit = async () => {
    if (!name || !phone) {
      alert("Please enter name and mobile number");
      return;
    }

    if (!agreeTerms) {
      alert("Please accept terms & conditions");
      return;
    }

    if (!pg?._id && !pg?.id) {
      alert("Property not found");
      return;
    }

    try {
      setLoadingSubmit(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            phone,
            message: contactMessage,
            propertyId: pg._id || pg.id,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to submit");
      }

      alert("Request submitted successfully");

      setName("");
      setPhone("");
      setAgreeTerms(false);
    } catch (err) {
      alert("Failed to submit request");
      console.error(err);
    } finally {
      setLoadingSubmit(false);
    }
  };


  // ✅ LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  // ✅ NOT FOUND STATE
  if (!pg) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Property Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The property you're looking for doesn't exist.
          </p>
          <a
            href="/listing"
            className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
          >
            Back to Listings
          </a>
        </div>
      </div>
    );
  }

  const description = pg.description || "";
  const shortDesc =
    description.length > 220
      ? description.substring(0, 220) + "..."
      : description;

  // ✅ CRITICAL FIX: Get current image safely with fallback
  const currentImage =
    pg.images && pg.images.length > 0 && pg.images[currentImageIndex]
      ? pg.images[currentImageIndex]
      : pg.primaryImage;



  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold mb-6 text-gray-900">
                {pg.name} 
              </h2>
                <span className="px-3 py-1 mb-4 bg-yellow-500 text-gray-700 text-sm rounded-md">
                  {pg.gender}
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">
              PG in - {pg.location.address} {pg.location.area}, {pg.location.city}
              </h2>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            </button>
          </div>
          <button className="mt-4 flex items-center gap-2 text-teal-500 hover:text-teal-600 font-medium">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Show on Map
          </button>
        </div>
      </div>

      {/* Image Gallery + Booking Form Section */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-[1fr,400px] gap-6">
          {/* Image Gallery */}
          <div className="relative rounded-2xl overflow-hidden h-[400px] bg-gray-100">
            <span className="absolute top-4 left-4 bg-teal-500 text-white px-3 py-1 rounded-md text-sm font-medium z-10">
              Preferred By Working Professionals
            </span>

            {/* ✅ CRITICAL FIX: Use currentImage variable */}
            <Image
              src={`${API_URL}${currentImage}`}
              alt={pg.name}
              fill
              className="object-cover"
              unoptimized
              onError={(e) => {

                // Set fallback image
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800";
              }}
            />

            {pg.images && pg.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 text-gray-800 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all z-10"
                  aria-label="Previous image"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 text-gray-800 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all z-10"
                  aria-label="Next image"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}

            {pg.images && pg.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {pg.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 rounded-full transition-all ${index === currentImageIndex
                      ? "bg-teal-500 w-8"
                      : "bg-white/60 w-2"
                      }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}

            <div className="absolute bottom-4 left-4 bg-black/60 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              45 People Viewing Now
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-teal-50 rounded-2xl p-6 border-2 border-teal-200">
            {/* Mode Switch */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setFormMode("visit")}
                className={`flex-1 py-3 rounded-xl font-semibold transition ${formMode === "visit"
                  ? "bg-teal-500 text-white"
                  : "bg-white text-gray-600"
                  }`}
              >
                Schedule a Visit
              </button>

              <button
                onClick={() => setFormMode("reserve")}
                className={`flex-1 py-3 rounded-xl font-semibold transition ${formMode === "reserve"
                  ? "bg-teal-500 text-white"
                  : "bg-white text-gray-600"
                  }`}
              >
                Reserve Now
              </button>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-3 rounded-xl bg-white border border-teal-200 outline-none focus:border-teal-400"
              />

              {/* Phone */}
              <div className="flex gap-2">
                <div className="w-20 px-3 py-3 rounded-xl bg-white border border-teal-200 flex items-center justify-center gap-1">
                  <span className="text-2xl">🇮🇳</span>
                  <span className="text-sm">+91</span>
                </div>

                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 px-5 py-3 rounded-xl bg-white border border-teal-200 outline-none focus:border-teal-400"
                />
              </div>

              {/* Info */}
              <div className="bg-black border border-yellow-100 rounded-xl p-4 text-center text-teal-400 text-sm">
                We accept bookings with a minimum stay of 3 months.
              </div>

              {/* WhatsApp */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="whatsapp"
                  className="w-5 h-5 accent-teal-500"
                />
                <label
                  htmlFor="whatsapp"
                  className="text-sm text-gray-700 flex items-center gap-2"
                >
                  <span className="text-green-500 font-bold">WhatsApp</span>
                  Get updates over WhatsApp
                </label>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-5 h-5 mt-0.5 accent-teal-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I have read and agreed to the{" "}
                  <a href="#" className="text-teal-600 hover:underline">
                    terms and conditions
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-teal-600 hover:underline">
                    privacy policy
                  </a>
                </label>
              </div>

              {/* Submit */}
              <button
                onClick={handleContactSubmit}
                disabled={loadingSubmit}
                className="w-full bg-teal-500 text-white font-bold text-lg py-4 rounded-xl shadow-md hover:bg-teal-600 transition disabled:opacity-60"
              >
                {loadingSubmit
                  ? "Submitting..."
                  : formMode === "visit"
                    ? "Schedule a Visit"
                    : "Reserve Now"}
              </button>
            </div>
          </div>

        </div>

        {/* Price Section */}

      </div>

      {/* Sticky Tabs */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex">
            {(["occupancy", "amenities", "details"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  const element = document.getElementById(tab);
                  if (element) {
                    window.scrollTo({
                      top: element.offsetTop - 80,
                      behavior: "smooth",
                    });
                  }
                }}
                className={`flex-1 py-4 text-lg font-semibold relative transition-colors ${activeTab === tab ? "text-teal-500" : "text-gray-500"
                  }`}
              >
                {tab === "occupancy"
                  ? "Occupancy"
                  : tab === "amenities"
                    ? "Amenities"
                    : "Details"}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-teal-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="bg-white">
        {/* Occupancy Section */}
        <section
          id="occupancy"
          className="py-16 px-6 max-w-7xl mx-auto scroll-mt-20"
        >
          <h2 className="text-3xl font-bold mb-8 text-gray-900">
            Available Occupancies
          </h2>
          <div className="flex flex-wrap gap-6">
            {pg.roomTypes?.map((room) => (
              <div
                key={room.id}
                className="bg-gray-50 rounded-2xl p-6 w-full sm:w-72 border border-gray-200"
              >
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span>× {room.capacity}</span>
                </div>
                <p className="text-lg font-bold capitalize text-gray-900 mb-3">
                  {room.type} Occupancy
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{room.pricePerMonth.toLocaleString("en-IN")}
                  <span className="text-sm text-gray-500 font-normal">
                    /mo*
                  </span>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Amenities Section */}
        <section
          id="amenities"
          className="py-16 px-6 max-w-7xl mx-auto scroll-mt-20 bg-gray-50"
        >
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">
                Amenities
              </h2>
              <div className="flex flex-wrap gap-3">
                {pg.amenities && pg.amenities.length > 0 ? (
                  pg.amenities.map((item) => (
                    <span
                      key={item._id}
                      className="px-5 py-2.5 bg-white rounded-full border border-gray-300 text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                      {item.name}
                    </span>
                  ))
                ) : (
                  <span className="px-5 py-2.5 bg-white rounded-full border border-gray-300 text-sm font-medium text-gray-700">
                    No amenities listed
                  </span>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">
                Services
              </h2>

              <div className="flex flex-wrap gap-3">
                {pg.services && pg.services.length > 0 ? (
                  pg.services.map((item) => (
                    <span
                      key={item._id}
                      className="px-5 py-2.5 bg-white rounded-full border border-gray-300 text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={20}
                        height={20}
                        className="object-contain"
                      />
                      {item.name}
                    </span>
                  ))
                ) : (
                  <span className="px-5 py-2.5 bg-white rounded-full border border-gray-300 text-sm font-medium text-gray-700">
                    No services listed
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Details Section */}
        <section
          id="details"
          className="py-16 px-6 max-w-7xl mx-auto scroll-mt-20"
        >
          <div className="space-y-12">
            {/* Food Menu */}
            {pg.foodMenu && pg.foodMenu.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold mb-8 text-gray-900">
                  Food Menu
                </h2>
                <div className="bg-teal-50 rounded-2xl p-6 overflow-x-auto">
                  <div className="grid grid-cols-[120px_1fr_1fr_1fr] gap-4 min-w-[800px]">
                    {/* Header */}
                    <div className="font-bold text-teal-700">
                      Days
                      <br />
                      Mon - Sun
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-teal-700 mb-1">
                        Breakfast
                      </div>
                      <div className="text-xs text-gray-600">07:30 - 09:00</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-teal-700 mb-1">Lunch</div>
                      <div className="text-xs text-gray-600">12:30 - 14:30</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-teal-700 mb-1">Dinner</div>
                      <div className="text-xs text-gray-600">19:30 - 21:00</div>
                    </div>

                    {/* Rows */}
                    {pg.foodMenu.map((menu, index) => (
                      <React.Fragment key={index}>
                        <div className="font-semibold text-teal-600 py-3">
                          {menu.day}
                        </div>
                        <div className="bg-white rounded-lg p-3 text-sm text-gray-700">
                          {menu.breakfast || "-"}
                        </div>
                        <div className="bg-white rounded-lg p-3 text-sm text-gray-700">
                          {menu.lunch || "-"}
                        </div>
                        <div className="bg-white rounded-lg p-3 text-sm text-gray-700">
                          {menu.dinner || "-"}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 mt-6">
                    *This food menu is currently being served on the residence
                    and is subject to change in future.
                  </p>
                </div>
              </div>
            )}

            {/* About This Residence */}
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">
                {pg.name} – PG in {pg.location.area}, {pg.location.city}
              </h2>
              <div className="prose max-w-none text-gray-700">
                <p>{showMore ? description : shortDesc}</p>
                {description.length > 220 && (
                  <button
                    onClick={() => setShowMore(!showMore)}
                    className="mt-3 text-teal-600 font-semibold hover:underline"
                  >
                    {showMore ? "Read less" : "Read more"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-xl hover:bg-green-600 transition z-50"
        aria-label="Chat on WhatsApp"
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
