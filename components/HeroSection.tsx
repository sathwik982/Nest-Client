"use client";

import Image from "next/image";
import Link from "next/link";
import { KnowMore } from "./KnowMore";
import BannerSlider from "./banner";
import ThemeToggle from "./ThemeToggle";
import { FaCity } from "react-icons/fa6";
import { BsFillBuildingsFill } from "react-icons/bs";
import { IoBedSharp } from "react-icons/io5";
import ImageCard from "./HeroRightImageCard";

export default function HeroSection() {
  return (
    <div className="w-full bg-background text-foreground transition-colors duration-300">
      {/* NAVBAR */}
      <header className="flex items-center justify-between px-6 md:px-16 py-4 bg-card shadow-md border-b border-border">
        <div className="flex items-center gap-3">
          <Image
            src="/logobg.png"
            alt="logo"
            width={80}
            height={80}
            className="object-contain"
          />
          <div className="leading-tight hidden sm:block">
            <p className="text-sm font-semibold">Nest Living</p>
            <p className="text-xs text-muted-foreground">
              A smarter way to live
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-6 text-sm md:text-base font-medium">
          <Link href="/" className="hover:text-brand-gold transition">
            Explore
          </Link>
          <KnowMore />
          <ThemeToggle />
        </nav>
      </header>

      {/* HERO MAIN */}
      <main className="flex flex-col lg:flex-row gap-8 px-6 md:px-16 lg:px-24 py-8">
        {/* LEFT (Slider) */}
        <div className="w-full lg:w-[70%]">
          <BannerSlider />
        </div>

        {/* RIGHT (Cards) */}
        <div className="w-full lg:w-[30%] flex flex-col gap-6">
          <ImageCard
            title="PG's for Student Living"
            desc="New-age PG's with all amenities and a vibrant community."
            img="/Student.avif"
          />

          <ImageCard
            title="PG's for Professionals"
            desc="Hotel-style stays designed to be close to your office."
            img="/work.avif"
          />

          <ImageCard
            title="Luxurious PG's"
            desc="Fully furnished Luxurious with all essentials taken care of."
            img="/Apartments.avif"
          />
        </div>
      </main>

      <hr className="border-border" />

      {/* ICON BAR */}
      <section className="flex flex-wrap justify-between items-center gap-4 px-6 md:px-16 lg:px-24 py-6 text-sm md:text-base">
        <div className="flex items-center gap-2 text-muted-foreground">
          <FaCity />
          <span className="font-semibold text-foreground">Cities</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <BsFillBuildingsFill />
          <span className="font-semibold text-foreground">Residences</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <IoBedSharp />
          <span className="font-semibold text-foreground">Beds</span>
        </div>
      </section>

      {/* Home page - 2nd half */}
      <section className="px-6 md:px-16 lg:px-32 pb-16 pt-4 bg-secondary">
        {/* Heading */}
        <div className="text-center mt-10 mb-12">
          <h2 className="text-2xl md:text-4xl font-semibold leading-tight">
            <span className="text-brand-gold">Not just</span>{" "}
            <span>four walls and a roof</span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Come over and experience how a place to stay can be so much more.
            Thoughtfully designed spaces, services and community that make every
            day feel lighter.
          </p>
        </div>

        {/* Content row */}
        <div className="flex flex-col lg:flex-row items-center gap-10">
          {/* LEFT – IMAGE COLLAGE */}
          <div className="w-full max-w-xl">
            <div className="grid grid-cols-2 gap-4 h-full">
              {/* Tall building image */}
              <div className="col-span-1 row-span-2 rounded-3xl overflow-hidden">
                <Image
                  src="/building.avif"
                  alt="Residence building"
                  width={450}
                  height={520}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Top-right image */}
              <div className="rounded-3xl overflow-hidden">
                <Image
                  src="/Area.avif"
                  alt="Common area"
                  width={260}
                  height={240}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Bottom-right image */}
              <div className="rounded-3xl overflow-hidden">
                <Image
                  src="/Corridor.avif"
                  alt="Corridor and common space"
                  width={260}
                  height={240}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* RIGHT – TEXT CONTENT */}
          <div className="w-full max-w-lg">
            <h3 className="text-2xl md:text-3xl font-semibold leading-snug">
              Start living your best life
              <br />
              from <span className="text-brand-gold">day one</span>
            </h3>

            <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
              Bring a box full of hopes, dreams, ambitions… and of course, your
              personal belongings. Everything else – furniture, appliances,
              food, housekeeping and maintenance – has already been taken care
              of for you.
            </p>

            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              <li>• Fully furnished rooms the moment you walk in</li>
              <li>• Chef-cooked meals so you don't have to think about food</li>
              <li>• High-speed WiFi and comfortable common areas</li>
              <li>• A community that makes the city feel a little less new</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
