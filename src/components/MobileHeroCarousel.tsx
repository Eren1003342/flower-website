"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type MobileHeroItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
};

export default function MobileHeroCarousel({ items }: { items: MobileHeroItem[] }) {
  const validItems = useMemo(() => items.filter((item) => item.slug && item.image), [items]);
  const [activeIndex, setActiveIndex] = useState(() =>
    validItems.length > 0 ? Math.floor(Math.random() * validItems.length) : 0,
  );
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (validItems.length <= 1) {
      return;
    }

    let fadeTimeout: ReturnType<typeof setTimeout> | null = null;
    const interval = setInterval(() => {
      setIsVisible(false);
      fadeTimeout = setTimeout(() => {
        setActiveIndex((previous) => {
          let next = Math.floor(Math.random() * validItems.length);
          while (next === previous) {
            next = Math.floor(Math.random() * validItems.length);
          }
          return next;
        });
        setIsVisible(true);
      }, 240);
    }, 3000);

    return () => {
      clearInterval(interval);
      if (fadeTimeout) {
        clearTimeout(fadeTimeout);
      }
    };
  }, [validItems]);

  const activeItem = validItems[activeIndex];
  if (!activeItem) {
    return (
      <Link
        href="/katalog"
        className="group lg:hidden mb-4 block rounded-2xl overflow-hidden border border-white/20 bg-black/25"
      >
        <div className="relative h-56">
          <Image src="/placeholder-flower.svg" alt="Çiçek koleksiyonu" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-cream-50/80">Atölye Akışı</p>
            <p className="mt-1 text-base font-semibold text-cream-50 line-clamp-1">El Yapımı Çiçek Koleksiyonu</p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/urun/${activeItem.slug}`}
      className="group lg:hidden mb-4 block rounded-2xl overflow-hidden border border-white/20 bg-black/25"
    >
      <div className={`relative h-56 transition-opacity duration-500 ease-in-out ${isVisible ? "opacity-100" : "opacity-25"}`}>
        <Image
          src={activeItem.image}
          alt={activeItem.name}
          fill
          sizes="100vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-cream-50/80">Atölye Akışı</p>
          <p className="mt-1 text-base font-semibold text-cream-50 line-clamp-1">{activeItem.name}</p>
          <div className="mt-2 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-slate-900">
            {activeItem.price} ₺
          </div>
        </div>
      </div>
    </Link>
  );
}
