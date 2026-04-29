"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X, Shield, Flower } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";

export default function Navbar({ brandName = "Eleanor Çiçek" }: { brandName?: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-cream-50/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-sage-200 dark:border-slate-800 transition-colors duration-300">
      <div className="w-full px-4 sm:px-6 md:px-10 lg:px-24 h-16 sm:h-20 flex items-center justify-between relative">
        <Link
          href="/"
          className="inline-flex max-w-[58vw] sm:max-w-[62vw] lg:max-w-none items-center gap-2 sm:gap-2.5 text-[1.35rem] sm:text-[1.8rem] lg:text-[2.2rem] font-semibold tracking-tight text-sage-800 dark:text-cream-50 drop-shadow-sm pl-1 sm:pl-2 pr-1 z-10 brand-logo-text"
          style={{ fontFamily: "var(--font-brand)" }}
        >
          <span className="inline-flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 border border-rose-300/80 shadow-sm">
            <Flower className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-rose-600" />
          </span>
          <span className="whitespace-nowrap leading-[1.2] sm:leading-[1.08] pb-[1px]">{brandName}</span>
        </Link>
        <div className="hidden lg:flex gap-8 text-sage-800/80 dark:text-cream-50/80 font-medium tracking-wide absolute left-1/2 -translate-x-1/2 w-max">
          <Link href="/" className="hover:text-rose-500 transition-colors">Ana Sayfa</Link>
          <Link href="/katalog" className="hover:text-rose-500 transition-colors">Katalog</Link>
          <Link href="/hakkimizda" className="hover:text-rose-500 transition-colors">Hakkımızda</Link>
          <Link href="/iletisim" className="hover:text-rose-500 transition-colors">İletişim</Link>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 z-10">
          <ThemeToggle />
          <Link
            href="/katalog"
            className="bg-sage-500 text-white p-2.5 sm:p-2 rounded-full hover:bg-sage-800 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
          </Link>
          <Link
            href="/admin/giris"
            className="hidden lg:inline-flex items-center gap-2 rounded-full border border-sage-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 px-4 py-2 text-sm font-medium text-sage-800 dark:text-cream-50 hover:bg-sage-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Shield className="w-4 h-4" />
            Panel
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Mobil menüyü aç"
            className="lg:hidden bg-white/70 dark:bg-slate-900/80 border border-sage-200 dark:border-slate-700 text-sage-800 dark:text-cream-50 p-2.5 sm:p-2 rounded-full"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pb-4">
          <div className="rounded-2xl border border-sage-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/95 backdrop-blur-sm p-3 flex flex-col gap-1">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-xl text-sage-800 dark:text-cream-50 hover:bg-sage-100 dark:hover:bg-slate-800 transition-colors">
              Ana Sayfa
            </Link>
            <Link href="/katalog" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-xl text-sage-800 dark:text-cream-50 hover:bg-sage-100 dark:hover:bg-slate-800 transition-colors">
              Katalog
            </Link>
            <Link href="/hakkimizda" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-xl text-sage-800 dark:text-cream-50 hover:bg-sage-100 dark:hover:bg-slate-800 transition-colors">
              Hakkımızda
            </Link>
            <Link href="/iletisim" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-xl text-sage-800 dark:text-cream-50 hover:bg-sage-100 dark:hover:bg-slate-800 transition-colors">
              İletişim
            </Link>
            <Link href="/admin/giris" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-xl text-sage-800 dark:text-cream-50 hover:bg-sage-100 dark:hover:bg-slate-800 transition-colors">
              Admin Panel
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
