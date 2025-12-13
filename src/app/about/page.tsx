"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function AboutPage() {
  // const [showScrollTop, setShowScrollTop] = useState(false);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     setShowScrollTop(window.scrollY > 300);
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  // const scrollToTop = () => {
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // };

  return (
    <div className="min-h-screen bg-[#151615]">
      {/* Hero Section - Reduced padding */}
      <div className="relative py-12 px-4 text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
          <span className="text-white">About </span>
          <span className="text-[#f1a10d]">Us</span>
        </h1>
      </div>

      {/* Section 1: Text Left, Image Right */}
      <section className="max-w-7xl mx-auto px-6 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left - Text Content */}
          <div className="space-y-5 order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              <span className="text-white">We didn't find it for us,</span>
              <br />
              <span className="text-[#f1a10d]">so we created it for you</span>
            </h2>

            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              That's essentially our story in one sentence. Crammed up hostels
              or cooped up PGs - not much of a choice, is it? That's why we
              created Stanza Living - a place designed by people who've been in
              your shoes. Understand you. And are inspired by you.
            </p>
          </div>

          {/* Right - Image - Reduced height */}
          <div className="relative h-[300px] md:h-[350px] lg:h-[400px] rounded-2xl overflow-hidden shadow-xl order-1 lg:order-2">
            <Image
              src="/about-us-image1.avif"
              alt="Modern living space"
              fill
              className="object-cover"
              priority
            />
            {/* Decorative dots */}
            <div className="absolute -bottom-8 -left-8 w-24 h-24 opacity-20 hidden lg:block">
              <div className="grid grid-cols-4 gap-2">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-[#151615]" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Image Left, Text Right */}
      <section className="max-w-7xl mx-auto px-6 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left - Image - Reduced height */}
          <div className="relative h-[300px] md:h-[350px] lg:h-[400px] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/banner1.avif"
              alt="Modern building architecture"
              fill
              className="object-cover"
            />
            {/* Decorative dots */}
            <div className="absolute -bottom-8 -right-8 w-24 h-24 opacity-20 hidden lg:block">
              <div className="grid grid-cols-4 gap-2">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-[" />
                ))}
              </div>
            </div>
          </div>

          {/* Right - Text Content */}
          <div className="space-y-5">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              <span className="text-white">You needed a place like home,</span>
              <br />
              <span className="text-[#f1a10d]">so we moved back home</span>
            </h2>

            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
              It was 2015. Two erstwhile IIM-A hostel roomies, Anindya and
              Sandeep, met again. Reminiscing about the 'good old hostel days',
              they realised a lot of that 'good' could've been better. So to
              give youngsters that 'better', in 2017, they set up a base in New
              Delhi, and the rest, as we say, is the present.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Center Text with background gradient */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        {/* Background gradient/pattern */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Decorative dots - bottom left */}
        <div className="absolute bottom-10 left-10 w-32 h-32 opacity-20">
          <div className="grid grid-cols-4 gap-2">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-[#151615]" />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            <span className="text-white">You moved to a new city,</span>
            <br />
            <span className="text-[#f1a10d]">so we moved there too</span>
          </h2>
        </div>
      </section>

      {/* Scroll to Top Button - Only visible after scrolling */}
      {/* {showScrollTop && ( */}
      {/* <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-50 w-12 h-12 bg-[#151615] hover:bg-[#4d504d] text-gray-100 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 animate-in fade-in slide-in-from-bottom-4"
          aria-label="Scroll to top"
        >
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
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>  */}
    </div>
  );
}
