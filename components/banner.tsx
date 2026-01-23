"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TbTarget } from "react-icons/tb";
import { useRouter } from "next/navigation";

const slides = [
  {
    id: 1,
    image: "/img1.jpeg",
    title: "Come, live the new kind of Living.",
    subtitle: "Life at a professionally managed accommodation awaits you.",
    placeholder: "locality",
  },
  {
    id: 2,
    image: "/img2.jpeg",
    title: "You've got 99 problems, but brokerage ain't one.",
    subtitle: "Move in without having to pay a fortune.",
    placeholder: "office",
  },
  {
    id: 3,
    image: "/img3.jpeg",
    title: "Multiple options. Zero judgements passed.",
    subtitle: "Co-ed. Girls-only. Boys-only. All types of residences available.",
    placeholder: "location",
  },
  {
    id: 4,
    image: "/img4.jpeg",
    title: "Spend less time commuting and more hours unwinding.",
    subtitle: "Live close to your college or workspace.",
    placeholder: "office",
  },
];

export default function ExactHeroSlider() {
  const [current, setCurrent] = useState(0);
  const [searchText, setSearchText] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Slide auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = () => {
    if (!searchText.trim()) {
      inputRef.current?.focus();
      return;
    }
    router.push(`/listing?query=${encodeURIComponent(searchText)}`);
  };

  return (
    <section className="relative w-full h-[570px] bg-background text-foreground overflow-hidden font-sans">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0 flex flex-col lg:flex-row"
        >

          <div className="w-full lg:w-[50%] h-full flex flex-col justify-start mt-10 px-10 md:px-20 lg:px-24 z-20">
            <div className="relative z-30 pointer-events-none">
              <h1 className="text-foreground font-bold text-5xl md:text-7xl  leading-[1.05] tracking-tight w-full lg:w-[230%]">
                {slides[current].title}
              </h1>
              <p className="mt-6 text-lg md:text-xl  max-w-md font-medium leading-relaxed">
                {slides[current].subtitle}
              </p>
            </div>
          </div>


          <div className="hidden lg:flex w-[50%] h-full pt-6 pr-6 pb-6">
            <div className="relative w-full h-full lg:h-[120%] overflow-hidden ">
              <Image
                src={slides[current].image}
                alt="banner"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>


          <div className="lg:hidden absolute inset-0 -z-10 opacity-20">
            <Image src={slides[current].image} alt="banner" fill className="object-cover" />
          </div>
        </motion.div>
      </AnimatePresence>


      <div className="absolute bottom-12 bulr left-10 md:left-20 lg:left-24 z-40 w-[90%] md:w-[680px] ">
        <div className=" rounded-2xl backdrop-blur-2xl shadow-[0_15px_50px_rgba(0,0,0,0.1)] p-3 md:p-4 flex items-center justify-between">
          
    
          <div className="flex flex-col flex-1 pl-4">
            <label htmlFor="hero-search" className="text-sm font-bold">
              Find in and around...
            </label>
            <div className="flex items-center gap-1 text-sm">
              <span className=" whitespace-nowrap">Search your</span>
              <input
                id="hero-search"
                ref={inputRef}
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder={slides[current].placeholder}
                className="bg-transparent border-none outline-none text-[#66C2A9] font-semibold placeholder-[#66C2A9] w-full"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => inputRef.current?.focus()}
              className="p-3 rounded-full  text-[#66C2A9] hover:bg-[#66C2A9]/20 transition active:scale-95"
            >
              <TbTarget size={24} />
            </button>
            <button 
              onClick={handleSearch}
              className="bg-[#66C2A9] hover:bg-[#58a892]  px-8 py-3 rounded-xl font-bold transition shadow-lg shadow-[#66C2A9]/20 active:scale-95"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* NAVIGATION DOTS */}
      <div className="absolute bottom-0 left-10 md:left-20 lg:left-24 flex items-center gap-4 z-40">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="group relative flex items-center justify-center w-6 h-6"
          >
            {current === i ? (
              <span className="w-5 h-5 rounded-full border-2 border-[#66C2A9] flex items-center justify-center transition-all">
                <span className="w-2 h-2 rounded-full bg-[#66C2A9]" />
              </span>
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-gray-400 transition-all" />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}