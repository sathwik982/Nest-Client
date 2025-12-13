"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { TbCurrentLocation } from "react-icons/tb";
import { useRouter } from "next/navigation";

export default function BannerSlider() {
  const slides = [
    {
      id: 1,
      image: "/banner1.avif",
      title: "Come, live the new kind of living.",
      subtitle: "Professionally managed spaces that feel like home.",
    },
    {
      id: 2,
      image: "/banner2.avif",
      title: "Zero brokerage. Zero hassle.",
      subtitle: "Move in without paying a fortune upfront.",
    },
    {
      id: 3,
      image: "/banner3.avif",
      title: "Stay your way.",
      subtitle: "Co-ed, girls-only or boys-only – the choice is yours.",
    },
    {
      id: 4,
      image: "/banner4.avif",
      title: "Closer to what matters.",
      subtitle: "Live near your college or workplace and save time.",
    },
  ];

  const [current, setCurrent] = useState(0);
  const [word, setWord] = useState(0);
  const [searchText, setSearchText] = useState("");

  const rotating = ["landmark", "location", "college", "office", "locality"];

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrent((p) => (p + 1) % slides.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, [slides.length]);

  useEffect(() => {
    const wordTimer = setInterval(() => {
      setWord((p) => (p + 1) % rotating.length);
    }, 1500);
    return () => clearInterval(wordTimer);
  }, []);

  const handleSearch = () => {
    const query = searchText.trim();
    if (!query) return;
    router.push(`/listing?query=${encodeURIComponent(query)}`);
  };

  const handleWordClick = () => {
    const value = rotating[word];
    setSearchText(value);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full h-[420px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl bg-card">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${
            current === i ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex h-full">
            {/* LEFT TEXT */}
            <div className="w-[40%] flex flex-col justify-center px-6 md:px-10 z-10">
              <h1 className="text-foreground w-[190%] font-bold text-2xl md:text-4xl lg:text-5xl leading-tight">
                {slide.title}
              </h1>

              <p className="text-muted-foreground w-[150%] mt-4 text-sm md:text-lg">
                {slide.subtitle}
              </p>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative w-[60%] h-full">
              <Image
                src={slide.image}
                alt="banner"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* DARK GRADIENT OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-r from-card/80 via-card/40 to-transparent" />
        </div>
      ))}

      {/* SEARCH BAR */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-secondary/95 backdrop-blur-sm p-3 md:p-3 w-[92%] md:w-[580px] rounded-xl shadow-2xl border border-border">
        <div className="flex items-center justify-between rounded-xl px-4 gap-3">
          <div className="flex flex-col">
            <p className="text-xs text-brand-gold">Find in and around...</p>

            <div className="flex items-center gap-1 text-sm md:text-base text-foreground mt-1">
              <span className="font-medium">Search</span>
              <button
                type="button"
                onClick={handleWordClick}
                className="font-semibold text-brand-gold transition-all duration-500"
              >
                {rotating[word]}
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-end">
            <div className="flex items-center bg-input border border-border rounded-full overflow-hidden shadow-sm w-full md:w-[380px]">
              <input
                ref={inputRef}
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Enter area, college, office..."
                className="px-4 py-2 text-sm md:text-base outline-none flex-1 bg-transparent"
              />

              <button
                type="button"
                className="px-2 md:px-3 h-full flex items-center justify-center border-l border-border hover:bg-muted transition"
              >
                <TbCurrentLocation className="text-lg md:text-xl text-muted-foreground" />
              </button>

              <button
                type="button"
                onClick={handleSearch}
                className="px-4 md:px-5 py-2 bg-brand-gold text-white text-sm md:text-base font-medium h-full hover:bg-brand-gold-dark transition rounded-r-full"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DOTS */}
      <div className="absolute bottom-4 w-full flex justify-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2.5 w-2.5 rounded-full cursor-pointer transition-all ${
              current === i ? "bg-brand-gold scale-125" : "bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
