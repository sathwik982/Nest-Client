"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";

const column1 = ["About Us"];
const column2 = ["Contact Us"];
const column3 = ["T&C"];
const column4 = ["Privacy Policy"];

export default function Footer() {
  return (
    <footer className="relative bg-secondary text-foreground border-t border-border transition-colors duration-300">
      {/* TOP ROW */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-0 py-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
        {/* LOGO */}
        <div className="flex-shrink-0 flex items-start gap-3">
          <div className="h-16 w-16 relative">
            <Image
              src="/logobg.png"
              alt="Nest logo"
              fill
              className="object-contain"
            />
          </div>
          <div className="hidden sm:block">
            <p className="text-lg font-semibold tracking-wide">Nest Living</p>
            <p className="text-xs text-muted-foreground mt-1">
              A smarter way to feel at home.
            </p>
          </div>
        </div>

        {/* LINK COLUMNS */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
          <FooterColumn items={column1} />
          <FooterColumn items={column2} />
          <FooterColumn items={column3} />
          <FooterColumn items={column4} />
        </div>

        {/* SOCIAL ICONS */}
        <div className="flex gap-4 justify-start lg:justify-end text-xl mt-2">
          <SocialIcon href="#" ariaLabel="Facebook">
            <FaFacebookF />
          </SocialIcon>
          <SocialIcon href="#" ariaLabel="LinkedIn">
            <FaLinkedinIn />
          </SocialIcon>
          <SocialIcon href="#" ariaLabel="Instagram">
            <FaInstagram />
          </SocialIcon>
          <SocialIcon href="#" ariaLabel="YouTube">
            <FaYoutube />
          </SocialIcon>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-0 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-[11px] text-muted-foreground border-t border-border">
        <p>
          Copyright © {new Date().getFullYear()} | All Rights Reserved by Nest
          Living.
        </p>
        <p className="text-[10px] md:text-[11px] text-center md:text-right">
          Images shown are for representational purposes only. Amenities
          depicted may vary across properties.
        </p>
      </div>

      {/* FLOATING WHATSAPP BUTTON */}
      <button
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 h-14 w-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_0_15px_2px_rgba(37,211,102,0.7)] hover:scale-110 transition-transform z-50"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp className="text-2xl text-white" />
      </button>
    </footer>
  );
}

function FooterColumn({ items }: { items: string[] }) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <Link
          key={item}
          href="#"
          className="block hover:text-brand-gold transition-colors"
        >
          {item}
        </Link>
      ))}
    </div>
  );
}

function SocialIcon({
  href,
  ariaLabel,
  children,
}: {
  href: string;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className="h-9 w-9 rounded-full border border-border flex items-center justify-center hover:bg-brand-gold hover:text-white hover:border-brand-gold transition-all"
    >
      {children}
    </Link>
  );
}
