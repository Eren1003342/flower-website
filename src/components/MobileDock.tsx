"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid2X2, PhoneCall, Flower2 } from "lucide-react";

function itemClass(isActive: boolean) {
  return isActive
    ? "flex flex-col items-center justify-center gap-1 text-rose-500"
    : "flex flex-col items-center justify-center gap-1 text-sage-700 dark:text-sage-200";
}

export default function MobileDock() {
  const pathname = usePathname();

  return (
    <>
      <div className="md:hidden fixed bottom-0 inset-x-0 z-50 px-3 pointer-events-none">
        <div className="pointer-events-auto mx-auto max-w-md rounded-2xl border border-sage-200/90 dark:border-slate-700/90 bg-cream-50/92 dark:bg-slate-900/92 shadow-xl backdrop-blur-md pb-safe">
          <div className="grid grid-cols-4 px-2 py-2">
            <Link href="/" className={itemClass(pathname === "/")}>
              <Home className="w-5 h-5" />
              <span className="text-[11px] font-medium">Ana Sayfa</span>
            </Link>
            <Link href="/katalog" className={itemClass(pathname.startsWith("/katalog") || pathname.startsWith("/urun/"))}>
              <Grid2X2 className="w-5 h-5" />
              <span className="text-[11px] font-medium">Katalog</span>
            </Link>
            <Link href="/iletisim" className={itemClass(pathname.startsWith("/iletisim"))}>
              <PhoneCall className="w-5 h-5" />
              <span className="text-[11px] font-medium">İletişim</span>
            </Link>
            <Link href="/hakkimizda" className={itemClass(pathname.startsWith("/hakkimizda"))}>
              <Flower2 className="w-5 h-5" />
              <span className="text-[11px] font-medium">Hakkımızda</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
