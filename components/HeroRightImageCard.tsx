"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface ImageCardProps {
  title: string;
  desc: string;
  img: string;
}

export default function ImageCard({ title, desc, img }: ImageCardProps) {
  const router = useRouter();

  const handleClick = () => {
    // Navigate to listing page when card is clicked
    router.push("/listing");
  };

  return (
    <div
      onClick={handleClick}
      className="relative w-full h-[180px] lg:h-[180px] rounded-2xl overflow-hidden cursor-pointer group transition-transform hover:scale-[1.02]"
    >
      {/* Background Image */}
      <Image
        src={img}
        alt={title}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-110"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linera-to-t from-black/80 via-black/40 to-transparent" />

      {/* Text Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="text-lg font-bold mb-1">{title}</h3>
        <p className="text-xs text-gray-200 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
