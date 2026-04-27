"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  const DISPLAY_MS = 3200;
  const TRANSITION_MS = 620;
  const validItems = useMemo(() => items.filter((item) => item.slug && item.image), [items]);
  const [activeIndex, setActiveIndex] = useState(() =>
    validItems.length > 0 ? Math.floor(Math.random() * validItems.length) : 0,
  );
  const [incomingIndex, setIncomingIndex] = useState<number | null>(null);
  const [isTransitionRunning, setIsTransitionRunning] = useState(false);
  const activeIndexRef = useRef(activeIndex);
  const transitioningRef = useRef(false);
  const switchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const preloadRequestRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    transitioningRef.current = isTransitionRunning;
  }, [isTransitionRunning]);

  useEffect(() => {
    if (validItems.length <= 1) {
      return;
    }
    const interval = setInterval(() => {
      if (transitioningRef.current) {
        return;
      }

      let next = Math.floor(Math.random() * validItems.length);
      while (next === activeIndexRef.current) {
        next = Math.floor(Math.random() * validItems.length);
      }

      const nextItem = validItems[next];
      if (!nextItem) {
        return;
      }

      const startTransition = () => {
        if (transitioningRef.current) {
          return;
        }
        setIncomingIndex(next);
        setIsTransitionRunning(false);
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = requestAnimationFrame(() => {
            setIsTransitionRunning(true);
          });
        });

        switchTimeoutRef.current = setTimeout(() => {
          setActiveIndex(next);
          setIncomingIndex(null);
          setIsTransitionRunning(false);
        }, TRANSITION_MS);
      };

      const requestId = ++preloadRequestRef.current;
      const preloader = new window.Image();
      preloader.decoding = "async";
      preloader.src = nextItem.image;

      if (preloader.complete) {
        if (requestId === preloadRequestRef.current) {
          startTransition();
        }
        return;
      }

      preloader.onload = () => {
        if (requestId !== preloadRequestRef.current) {
          return;
        }
        startTransition();
      };
      preloader.onerror = () => {
        if (requestId !== preloadRequestRef.current) {
          return;
        }
        startTransition();
      };
    }, DISPLAY_MS);

    return () => {
      clearInterval(interval);
      preloadRequestRef.current += 1;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (switchTimeoutRef.current) {
        clearTimeout(switchTimeoutRef.current);
      }
    };
  }, [validItems]);

  const activeItem = validItems[activeIndex];
  const incomingItem =
    incomingIndex !== null && incomingIndex >= 0 ? validItems[incomingIndex] : null;
  const clickableItem = isTransitionRunning && incomingItem ? incomingItem : activeItem;

  function renderSlide(item: MobileHeroItem, className: string) {
    return (
      <div
        className={className}
        style={{
          transitionDuration: `${TRANSITION_MS}ms`,
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "opacity, transform",
        }}
      >
        <Image src={item.image} alt={item.name} fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-cream-50/80">Atölye Akışı</p>
          <p className="mt-1 text-base font-semibold text-cream-50 line-clamp-1">{item.name}</p>
          <div className="mt-2 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-slate-900">
            {item.price} ₺
          </div>
        </div>
      </div>
    );
  }

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
      href={`/urun/${clickableItem.slug}`}
      className="group lg:hidden mb-4 block rounded-2xl overflow-hidden border border-white/20 bg-black/25"
    >
      <div className="relative h-56">
        {renderSlide(
          activeItem,
          `absolute inset-0 transition-[opacity,transform] ${
            isTransitionRunning ? "opacity-0 scale-[1.015]" : "opacity-100 scale-100"
          }`,
        )}
        {incomingItem
          ? renderSlide(
              incomingItem,
              `absolute inset-0 transition-[opacity,transform] ${
                isTransitionRunning ? "opacity-100 scale-100" : "opacity-0 scale-[1.04]"
              }`,
            )
          : null}
      </div>
    </Link>
  );
}
