"use client";

import React from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { FaWhatsapp, FaShareAlt, FaMapMarkerAlt, FaEye, FaChevronLeft, FaChevronRight, FaHome, FaPhone, FaCheck } from "react-icons/fa";

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
  name: string;
  location: {
    city: string;
    area: string;
    address: string;
    latitude?: number;
    longitude?: number;
  };
  gender?: string;
  images: string[];
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
  const [pageUrl, setPageUrl] = useState("");
  const [showWhatsApp, setShowWhatsApp] = useState(false);

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
    setPageUrl(window.location.href);
  }, []);

  const message = `Hi, I need help with this page: ${pageUrl}`;

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 1024) return; // Disable auto-scroll on mobile

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

  const scrollToSection = (sectionId: TabKey) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = window.innerWidth < 640 ? 100 : 80;
      window.scrollTo({
        top: element.offsetTop - offset,
        behavior: "smooth",
      });
      setActiveTab(sectionId);
    }
  };

  const handleContactSubmit = async () => {
    if (!name || !phone) {
      alert("Please enter name and mobile number");
      return;
    }

    if (!agreeTerms) {
      alert("Please accept terms & conditions");
      return;
    }

    if (!pg?._id) {
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
            propertyId: pg._id,
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
      <div className="min-h-screen flex items-center justify-center bg-background">
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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Property Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The property you're looking for doesn't exist.
          </p>
          <a
            href="/listing"
            className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition inline-block"
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

  const currentImage =
    pg.images && pg.images.length > 0 && pg.images[currentImageIndex]
      ? pg.images[currentImageIndex]
      : "";

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-muted-foreground wrap-break-word">
                  {pg.name}
                </h1>
                {pg.gender && (
                  <span className="px-3 py-1 bg-yellow-500 text-gray-700 text-sm rounded-md self-start sm:self-center whitespace-nowrap">
                    {pg.gender}
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg lg:text-xl text-gray-600 mb-4">
                PG in {pg.location.address}, {pg.location.area}, {pg.location.city}
              </h2>
              <button className="flex items-center gap-2 text-teal-500 hover:text-teal-600 font-medium text-sm sm:text-base">
                <FaMapMarkerAlt className="w-4 h-4" />
                Show on Map
              </button>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full self-start sm:self-center">
              <FaShareAlt className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Image Gallery & Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden h-[250px] sm:h-[350px] md:h-[400px] bg-background mb-6">
              <span className="absolute top-4 left-4 bg-teal-500 text-white px-3 py-1 rounded-md text-xs sm:text-sm font-medium z-10">
                Preferred By Working Professionals
              </span>

              {currentImage ? (
                <Image
                  src={`${API_URL}${currentImage}`}
                  alt={pg.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 66vw"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <FaHome className="w-16 h-16 text-gray-400" />
                </div>
              )}

              {pg.images && pg.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg transition-all z-10"
                    aria-label="Previous image"
                  >
                    <FaChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg transition-all z-10"
                    aria-label="Next image"
                  >
                    <FaChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </>
              )}

              {pg.images && pg.images.length > 1 && (
                <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-2">
                  {pg.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-1.5 sm:h-2 rounded-full transition-all ${
                        index === currentImageIndex
                          ? "bg-teal-500 w-4 sm:w-8"
                          : "bg-white/60 w-1.5 sm:w-2"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-black/60 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm flex items-center gap-2">
                <FaEye className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">45 People Viewing Now</span>
                <span className="sm:hidden">45 Viewing</span>
              </div>
            </div>

            {/* Mobile Booking Form - Only visible on mobile */}
            <div className="lg:hidden mb-8">
              <div className="bg-background rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-teal-200">
                {/* Mode Switch */}
                <div className="flex gap-2 mb-4 sm:mb-6">
                  <button
                    onClick={() => setFormMode("visit")}
                    className={`flex-1 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold border text-muted-foreground text-sm sm:text-base transition ${
                      formMode === "visit"
                        ? "bg-teal-500 text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    Schedule a Visit
                  </button>
                  <button
                    onClick={() => setFormMode("reserve")}
                    className={`flex-1 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-black font-semibold border text-sm sm:text-base transition ${
                      formMode === "reserve"
                        ? "bg-teal-500 text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    Reserve Now
                  </button>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-background text-muted-foreground border border-teal-200 outline-none focus:border-teal-400 text-sm sm:text-base"
                  />

                  <div className="flex gap-2">
                    <div className="w-16 sm:w-20 px-3 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-background text-muted-foreground border border-teal-200 flex items-center justify-center gap-1">
                      <span className="text-xl sm:text-2xl">🇮🇳</span>
                      <span className="text-xs sm:text-sm">+91</span>
                    </div>
                    <input
                      type="tel"
                      placeholder="Mobile Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex-1 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-white border border-teal-200 outline-none focus:border-teal-400 text-sm sm:text-base"
                    />
                  </div>

                  <div className="bg-black border border-yellow-100 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center text-teal-400 text-xs sm:text-sm">
                    We accept bookings with a minimum stay of 3 months.
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="whatsapp-mobile"
                      className="w-4 h-4 sm:w-5 sm:h-5 accent-teal-500"
                    />
                    <label
                      htmlFor="whatsapp-mobile"
                      className="text-xs sm:text-sm text-gray-700 flex items-center gap-1 sm:gap-2"
                    >
                      <span className="text-green-500 font-bold">WhatsApp</span>
                      Get updates over WhatsApp
                    </label>
                  </div>

                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="terms-mobile"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 accent-teal-500"
                    />
                    <label htmlFor="terms-mobile" className="text-xs sm:text-sm text-gray-700">
                      I agree to{" "}
                      <a href="#" className="text-teal-600 hover:underline">
                        terms
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-teal-600 hover:underline">
                        privacy policy
                      </a>
                    </label>
                  </div>

                  <button
                    onClick={handleContactSubmit}
                    disabled={loadingSubmit}
                    className="w-full bg-teal-500 text-white font-semibold sm:font-bold text-sm sm:text-base py-3 sm:py-4 rounded-lg sm:rounded-xl shadow-md hover:bg-teal-600 transition disabled:opacity-60"
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

            {/* Sticky Tabs */}
            <div className="sticky top-0 z-30  bg-background text-muted-foreground border-b border-teal-500 shadow-sm lg:hidden">
              <div className="flex">
                {(["occupancy", "amenities", "details"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => scrollToSection(tab)}
                    className={`flex-1 py-3 sm:py-4 text-sm sm:text-base font-medium relative transition-colors ${
                      activeTab === tab ? "text-teal-500" : "text-gray-500"
                    }`}
                  >
                    {tab === "occupancy"
                      ? "Occupancy"
                      : tab === "amenities"
                      ? "Amenities"
                      : "Details"}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-[3px] bg-teal-500 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Sections */}
            <div className=" bg-background text-muted-foreground">
              {/* Occupancy Section */}
              <section
                id="occupancy"
                className="py-8 sm:py-12 lg:py-16 scroll-mt-16 sm:scroll-mt-20"
              >
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-muted-foreground">
                  Available Occupancies
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {pg.roomTypes?.map((room) => (
                    <div
                      key={room.id}
                      className=" bg-background  rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-teal-500"
                    >
                      <div className="flex items-center gap-2 text-xs sm:text-sm  text-muted-foreground mb-2 sm:mb-3">
                        <FaHome className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>× {room.capacity}</span>
                      </div>
                      <p className="text-base sm:text-lg font-bold capitalize text-muted-foreground mb-2 sm:mb-3">
                        {room.type} Occupancy
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-muted-foreground">
                        ₹{room.pricePerMonth.toLocaleString("en-IN")}
                        <span className="text-xs sm:text-sm text-gray-500 font-normal ml-1">
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
                className="py-8 sm:py-12 lg:py-16 scroll-mt-16 sm:scroll-mt-20 bg-background"
              >
                <div className="space-y-8 sm:space-y-12">
                  <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-muted-foreground">
                      Amenities
                    </h2>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {pg.amenities && pg.amenities.length > 0 ? (
                        pg.amenities.map((item) => (
                          <span
                            key={item._id}
                            className="px-3 py-1.5 sm:px-4 sm:py-2  rounded-full border border-teal-500 text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1 sm:gap-2"
                          >
                            {item.imageUrl && (
                              <Image
                                src={item.imageUrl}
                                alt={item.name}
                                width={16}
                                height={16}
                                className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
                              />
                            )}
                            {item.name}
                          </span>
                        ))
                      ) : (
                        <span className="px-4 py-2 bg-background rounded-full border border-teal-500 text-sm font-medium text-muted-foreground">
                          No amenities listed
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-muted-foreground">
                      Services
                    </h2>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {pg.services && pg.services.length > 0 ? (
                        pg.services.map((item) => (
                          <span
                            key={item._id}
                            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-background rounded-full border border-teal-500 text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1 sm:gap-2"
                          >
                            {item.imageUrl && (
                              <Image
                                src={item.imageUrl}
                                alt={item.name}
                                width={16}
                                height={16}
                                className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
                              />
                            )}
                            {item.name}
                          </span>
                        ))
                      ) : (
                        <span className="px-4 py-2 bg-background rounded-full border border-teal-500 text-sm font-medium text-muted-foreground">
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
                className="py-8 sm:py-12 lg:py-16 scroll-mt-16 sm:scroll-mt-20"
              >
                <div className="space-y-8 sm:space-y-12">
                  {/* Food Menu */}
                  {pg.foodMenu && pg.foodMenu.length > 0 && (
                    <div>
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-muted-foreground">
                        Food Menu
                      </h2>
                      <div className="bg-teal-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 overflow-x-auto scrollbar-hide">
                        <div className="min-w-[600px] sm:min-w-[800px]">
                          <div className="grid grid-cols-4 gap-3 sm:gap-4">
                            {/* Header */}
                            <div className="font-bold text-teal-700 text-sm sm:text-base">
                              Days
                              <br className="hidden sm:block" />
                              <span className="text-xs sm:text-sm">Mon - Sun</span>
                            </div>
                            <div className="text-center">
                              <div className="font-bold text-teal-700 mb-1 text-sm sm:text-base">
                                Breakfast
                              </div>
                              <div className="text-xs text-muted-foreground">07:30 - 09:00</div>
                            </div>
                            <div className="text-center">
                              <div className="font-bold text-teal-700 mb-1 text-sm sm:text-base">
                                Lunch
                              </div>
                              <div className="text-xs text-muted-foreground">12:30 - 14:30</div>
                            </div>
                            <div className="text-center">
                              <div className="font-bold text-teal-700 mb-1 text-sm sm:text-base">
                                Dinner
                              </div>
                              <div className="text-xs text-muted-foreground">19:30 - 21:00</div>
                            </div>

                            {/* Rows */}
                            {pg.foodMenu.map((menu, index) => (
                              <React.Fragment key={index}>
                                <div className="font-semibold text-teal-600 py-2 sm:py-3 text-sm sm:text-base">
                                  {menu.day}
                                </div>
                                <div className="bg-white rounded-lg p-2 sm:p-3 text-xs sm:text-sm text-gray-700">
                                  {menu.breakfast || "-"}
                                </div>
                                <div className="bg-white rounded-lg p-2 sm:p-3 text-xs sm:text-sm text-gray-700">
                                  {menu.lunch || "-"}
                                </div>
                                <div className="bg-white rounded-lg p-2 sm:p-3 text-xs sm:text-sm text-gray-700">
                                  {menu.dinner || "-"}
                                </div>
                              </React.Fragment>
                            ))}
                          </div>
                          <p className="text-xs text-gray-600 mt-4 sm:mt-6">
                            *This food menu is currently being served on the residence
                            and is subject to change in future.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* About This Residence */}
                  <div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-muted-foreground">
                      About This Residence
                    </h2>
                    <div className="prose max-w-none text-gray-700 text-sm sm:text-base">
                      <p>{showMore ? description : shortDesc}</p>
                      {description.length > 220 && (
                        <button
                          onClick={() => setShowMore(!showMore)}
                          className="mt-2 sm:mt-3 text-teal-600 font-semibold hover:underline text-sm sm:text-base"
                        >
                          {showMore ? "Read less" : "Read more"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Right Column - Booking Form (Desktop only) */}
          <div className="hidden lg:block">
            <div className="sticky top-20">
              <div className="bg-background rounded-2xl p-6 border-2 border-teal-500">
                {/* Mode Switch */}
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setFormMode("visit")}
                    className={`flex-1 py-3 rounded-xl font-semibold transition border ${
                      formMode === "visit"
                        ? "bg-teal-500 text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    Schedule a Visit
                  </button>
                  <button
                    onClick={() => setFormMode("reserve")}
                    className={`flex-1 py-3 rounded-xl font-semibold transition border ${
                      formMode === "reserve"
                        ? "bg-teal-500 text-white"
                        : "bg-white text-black"
                    }`}
                  >
                    Reserve Now
                  </button>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-5 py-3 rounded-xl bg-background text-muted-foreground border border-teal-200 outline-none focus:border-teal-400"
                  />

                  <div className="flex gap-2">
                    <div className="w-20 px-3 py-3 rounded-xl bg-background text-muted-foreground border border-teal-200 flex items-center justify-center gap-1">
                      <span className="text-xl">🇮🇳</span>
                      <span className="text-lg">+91</span>
                    </div>
                    <input
                      type="tel"
                      placeholder="Mobile Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex-1 px-5 py-3 rounded-xl bg-background text-muted-foreground border border-teal-200 outline-none focus:border-teal-400"
                    />
                  </div>

                  <div className="bg-black border border-yellow-100 rounded-xl p-4 text-center text-teal-400 text-sm">
                    We accept bookings with a minimum stay of 3 months.
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="whatsapp-desktop"
                      className="w-5 h-5 accent-teal-500"
                    />
                    <label
                      htmlFor="whatsapp-desktop"
                      className="text-sm text-gray-700 flex items-center gap-2"
                    >
                      <span className="text-green-500 font-bold">WhatsApp</span>
                      Get updates over WhatsApp
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms-desktop"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-5 h-5 mt-0.5 accent-teal-500"
                    />
                    <label htmlFor="terms-desktop" className="text-sm text-gray-700">
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

              {/* Desktop Sticky Tabs */}
              <div className="sticky top-4 mt-6 bg-background text-muted-foreground border border-teal-200 shadow-sm rounded-xl">
                <div className="flex flex-col">
                  {(["occupancy", "amenities", "details"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => scrollToSection(tab)}
                      className={`px-4 py-3 text-left font-medium transition-colors border-b last:border-b-0 ${
                        activeTab === tab
                          ? "text-teal-500 bg-teal-50"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {tab === "occupancy"
                        ? "Occupancy"
                        : tab === "amenities"
                        ? "Amenities"
                        : "Details"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Action Buttons for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="flex gap-3">
          <button
            onClick={() => setShowWhatsApp(true)}
            className="flex-1 bg-green-500 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <FaWhatsapp className="w-5 h-5" />
            WhatsApp
          </button>
          <button
            onClick={handleContactSubmit}
            disabled={loadingSubmit}
            className="flex-1 bg-teal-500 text-white font-semibold py-3 rounded-lg"
          >
            {loadingSubmit ? "..." : "Book Now"}
          </button>
        </div>
      </div>

      {/* WhatsApp Button - Desktop */}
      <a
        href={`https://wa.me/919876543210?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden lg:fixed lg:flex bottom-6 right-6 bg-green-500 text-white w-12 h-12 rounded-full items-center justify-center shadow-xl hover:bg-green-600 transition z-50"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp className="text-2xl" />
      </a>

      {/* WhatsApp Modal for Mobile */}
      {showWhatsApp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 lg:hidden">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Chat on WhatsApp</h3>
            <p className="text-gray-600 mb-6">
              You'll be redirected to WhatsApp to start a conversation with our support team.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowWhatsApp(false)}
                className="flex-1 py-2.5 border border-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <a
                href={`https://wa.me/919876543210?text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-green-500 text-white py-2.5 rounded-lg text-center"
              >
                Open WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}