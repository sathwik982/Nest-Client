"use client";

import Image from "next/image";

export default function HomeSection() {
  return (
    <div className="bg-card text-foreground transition-colors duration-300">
      <section className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24 py-16">
        <div className="flex flex-col lg:flex-row items-center gap-12 relative z-1">
          {/* LEFT: TEXT */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-2xl md:text-4xl font-semibold leading-snug">
              Step into a room that has
              <br />
              <span className="text-brand-gold">room for everything</span>
            </h2>

            <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
              Your clothes and bag will not be fighting for space on the same
              chair. At your Nest home, there&apos;s ample room for all your
              possessions. Even a framed photo of your family, for the rare
              occasions you miss home.
            </p>

            <p className="mt-4 text-xs md:text-sm text-muted-foreground leading-relaxed">
              Cabinets, shelves and under-bed storage are designed so that every
              item has its spot, and your room still feels open and airy.
            </p>
          </div>

          {/* RIGHT – IMAGE COLLAGE */}
          <div className="w-full lg:w-1/2">
            <div className="grid grid-cols-2 gap-4 h-full">
              {/* Tall first image */}
              <div className="col-span-1 row-span-2 rounded-3xl overflow-hidden">
                <Image
                  src="/home_page_bed_1.avif"
                  alt="Residence exterior"
                  width={480}
                  height={520}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Top-right image */}
              <div className="rounded-3xl overflow-hidden">
                <Image
                  src="/home_page_bed_3.avif"
                  alt="Corridor and common space"
                  width={260}
                  height={240}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Bottom-right image */}
              <div className="rounded-3xl overflow-hidden">
                <Image
                  src="/home_page_bed_2.avif"
                  alt="Seating and lounge area"
                  width={260}
                  height={240}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
