"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

export default function ProductImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const galleryImages = useMemo(
    () => (images.length > 0 ? images : ["/placeholder-flower.svg"]),
    [images],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const hasManyImages = galleryImages.length > 1;

  const goPrev = () => {
    setActiveIndex((current) => (current === 0 ? galleryImages.length - 1 : current - 1));
  };

  const goNext = () => {
    setActiveIndex((current) => (current === galleryImages.length - 1 ? 0 : current + 1));
  };

  return (
    <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-white dark:bg-slate-900 shadow-xl dark:shadow-slate-800/20 isolate">
      <Image
        src={galleryImages[activeIndex]}
        alt={`${alt} - Görsel ${activeIndex + 1}`}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
        priority
      />

      {hasManyImages ? (
        <>
          <button
            type="button"
            aria-label="Önceki görsel"
            onClick={goPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-slate-900/45 text-white backdrop-blur-sm border border-white/25 hover:bg-slate-900/70 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mx-auto" />
          </button>
          <button
            type="button"
            aria-label="Sonraki görsel"
            onClick={goNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-slate-900/45 text-white backdrop-blur-sm border border-white/25 hover:bg-slate-900/70 transition-colors"
          >
            <ChevronRight className="w-5 h-5 mx-auto" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/55 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white border border-white/20">
              {activeIndex + 1} / {galleryImages.length}
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/45 backdrop-blur-sm px-2 py-1 border border-white/20">
              {galleryImages.map((_, index) => (
                <button
                  key={`gallery-dot-${index}`}
                  type="button"
                  aria-label={`${index + 1}. görsele git`}
                  onClick={() => setActiveIndex(index)}
                  className={`h-1.5 w-1.5 rounded-full transition-all ${
                    index === activeIndex ? "bg-white w-4" : "bg-white/55 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
