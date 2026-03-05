"use client";

import Image from "next/image";
import { useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Camera } from "lucide-react";

export default function RecipeImageCarousel({
  images,
  title,
}: {
  images: any[];
  title: string;
}) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const handleScroll = useCallback(() => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const center = container.scrollLeft + container.offsetWidth / 2;
    const children = Array.from(container.children) as HTMLElement[];

    const closestIndex = children.reduce((closest, child, index) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      return Math.abs(childCenter - center) <
        Math.abs(
          children[closest].offsetLeft +
            children[closest].offsetWidth / 2 -
            center,
        )
        ? index
        : closest;
    }, 0);

    if (closestIndex !== active) setActive(closestIndex);
  }, [active]);

  const scrollTo = (index: number) => {
    if (!sliderRef.current || index < 0 || index >= images.length) return;
    const container = sliderRef.current;
    const slide = container.children[index] as HTMLElement;

    container.scrollTo({
      left: slide.offsetLeft - (container.offsetWidth - slide.offsetWidth) / 2,
      behavior: "smooth",
    });
    setActive(index);
  };

  return (
    <div className="relative group">
      {/* COUNTER BADGE */}
      <div className="absolute top-4 right-4 z-30 opacity-0">
        <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
          <Camera className="w-3 h-3 text-white" />
          <span className="text-[10px] font-bold text-white tracking-widest">
            {active + 1} / {images.length}
          </span>
        </div>
      </div>

      {/* NAVIGATION - Polished Glass Buttons */}
      <button
        onClick={() => scrollTo(active - 1)}
        className={`absolute left-[-20px] top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white shadow-xl border border-stone-100 transition-all active:scale-90 hidden md:block
          ${active === 0 ? "opacity-0 invisible" : "opacity-100"}`}
      >
        <ChevronLeft className="w-5 h-5 text-stone-700" />
      </button>

      <button
        onClick={() => scrollTo(active + 1)}
        className={`absolute right-[-20px] top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white shadow-xl border border-stone-100 transition-all active:scale-90 hidden md:block
          ${active === images.length - 1 ? "opacity-0 invisible" : "opacity-100"}`}
      >
        <ChevronRight className="w-5 h-5 text-stone-700" />
      </button>

      {/* TRACK - Forced 4:3 Aspect Ratio (800x600 equivalent) */}
      <div
        ref={sliderRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth"
      >
        {images.map((img, i) => (
          <div
            key={i}
            className="relative flex-none w-full aspect-[4/3] snap-center overflow-hidden border border-stone-200 shadow-sm"
          >
            <Image
              src={img.url}
              alt={img.altText || title}
              width={800}
              height={600}
              className="w-full h-full object-cover"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {/* PAGINATION - Modern Minimalist */}
      <div className="flex justify-center gap-2 mt-6">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === active ? "w-10 bg-red-700" : "w-2 bg-stone-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
