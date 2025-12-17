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
    <footer className="relative bg-secondary text-foreground border-t border-border">
      {/* TOP SECTION */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 grid gap-10 lg:grid-cols-[auto_1fr_auto] items-start">

        {/* BRAND */}
        <div className="flex items-start gap-4">
          <div className="relative h-14 w-14">
            <Image
              src="/logobg.png"
              alt="Nest Living logo"
              fill
              className="object-contain"
            />
          </div>

          <div className="hidden sm:block">
            <p className="text-lg font-semibold tracking-wide">
              Nest Living
            </p>
            <p className="text-xs text-muted-foreground mt-1 max-w-[180px]">
              A smarter way to feel at home.
            </p>
          </div>
        </div>

        {/* LINKS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm justify-items-start">
          <FooterColumn items={column1} />
          <FooterColumn items={column2} />
          <FooterColumn items={column3} />
          <FooterColumn items={column4} />
        </div>

        {/* SOCIALS */}
        <div className="flex gap-4 justify-start lg:justify-end">
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

      {/* DIVIDER */}
      <div className="border-t border-border" />

      {/* BOTTOM BAR */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-[11px] text-muted-foreground">
        <p className="text-center md:text-left">
          © {new Date().getFullYear()} Nest Living. All rights reserved.
        </p>

        <p className="text-center md:text-right max-w-[420px] leading-relaxed">
          Images shown are for representational purposes only. Amenities may vary
          across properties.
        </p>
      </div>

      {/* WHATSAPP FLOAT */}
      <a
        href="https://wa.me/919876543210?text=Hi%20I%20would%20like%20to%20know%20more"
        target="_blank"
        rel="noopener noreferrer"
        title="Chat with us on WhatsApp"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center shadow-xl hover:scale-110 transition-transform z-50"
      >
        <FaWhatsapp className="text-2xl text-white" />
      </a>
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
          className="block text-muted-foreground hover:text-brand-gold transition-colors"
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
      className="h-9 w-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-brand-gold hover:text-white hover:border-brand-gold transition-all"
    >
      {children}
    </Link>
  );
}
