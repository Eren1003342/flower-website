import { notFound } from "next/navigation";
import { CheckCircle2, ChevronRight, MapPin, Truck } from "lucide-react";
import Link from "next/link";
import { getProductBySlug, getSiteContent } from "@/lib/cms";
import ProductImageGallery from "@/components/ProductImageGallery";

interface Props {
  params: Promise<{ slug: string }>;
}

function NeonShape({
  kind,
  className,
}: {
  kind: "heart" | "star" | "butterfly";
  className?: string;
}) {
  if (kind === "heart") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
        <path
          d="M12 20.5C9.7 18.8 4.5 14.9 4.5 10.1C4.5 7.5 6.5 5.5 9.1 5.5C10.8 5.5 12 6.4 12.9 7.7C13.8 6.4 15 5.5 16.7 5.5C19.3 5.5 21.3 7.5 21.3 10.1C21.3 14.9 16.1 18.8 13.8 20.5C13.3 20.9 12.5 20.9 12 20.5Z"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (kind === "butterfly") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
        <path
          d="M12 8.8C10.6 6.2 8.6 5.4 6.8 5.8C4.7 6.2 3.6 8.3 4.4 10.2C5.1 11.7 6.9 12.1 8.8 11.8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M12 8.8C13.4 6.2 15.4 5.4 17.2 5.8C19.3 6.2 20.4 8.3 19.6 10.2C18.9 11.7 17.1 12.1 15.2 11.8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M12 15.2C10.6 17.8 8.6 18.6 6.8 18.2C4.7 17.8 3.6 15.7 4.4 13.8C5.1 12.3 6.9 11.9 8.8 12.2"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M12 15.2C13.4 17.8 15.4 18.6 17.2 18.2C19.3 17.8 20.4 15.7 19.6 13.8C18.9 12.3 17.1 11.9 15.2 12.2"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path d="M12 7.5V16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M12 3L13.9 10.1L21 12L13.9 13.9L12 21L10.1 13.9L3 12L10.1 10.1L12 3Z" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" />
    </svg>
  );
}

function WhatsAppLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3.75C7.44 3.75 3.75 7.44 3.75 12c0 1.57.44 3.04 1.2 4.3L3.75 20.25l4.05-1.18A8.2 8.2 0 0 0 12 20.25c4.56 0 8.25-3.69 8.25-8.25S16.56 3.75 12 3.75z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 8.9c.16-.36.31-.37.58-.37h.43c.13 0 .3.05.37.2.12.28.46 1.12.5 1.2.05.08.08.18.01.29-.07.1-.1.16-.2.25-.1.09-.2.2-.28.27-.1.1-.2.2-.08.4.13.2.57.94 1.22 1.52.84.75 1.55.98 1.77 1.09.22.1.35.08.48-.05.13-.12.56-.65.72-.87.16-.22.31-.19.53-.11.22.08 1.36.64 1.6.76.24.12.39.18.45.28.06.1.06.6-.14 1.18-.2.57-1.16 1.1-1.6 1.17-.42.07-.96.1-1.55-.1-.36-.12-.82-.27-1.41-.53-2.46-1.06-4.06-3.61-4.18-3.78-.11-.18-1-1.34-1-2.55 0-1.2.63-1.79.85-2.04z"
        fill="currentColor"
      />
    </svg>
  );
}

export default async function ProductDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const [product, content] = await Promise.all([getProductBySlug(resolvedParams.slug), getSiteContent()]);

  if (!product) {
    return notFound();
  }

  const instagramHandle = content.contact.instagram.replace(/^@/, "");
  const instagramUrl = `https://instagram.com/${instagramHandle}`;
  const whatsappUrl = "https://wa.me/905013502209";

  return (
    <div className="relative w-full overflow-hidden bg-cream-50 dark:bg-slate-950 transition-colors duration-700 ease-in-out">
      <div className="pointer-events-none absolute inset-0">
        <NeonShape kind="heart" className="absolute left-[7%] top-[18%] h-6 w-6 sm:h-8 sm:w-8 text-rose-500/75 dark:text-rose-300/80 [filter:drop-shadow(0_0_8px_rgba(244,63,94,0.45))]" />
        <NeonShape kind="star" className="absolute left-[13%] top-[35%] h-5 w-5 sm:h-6 sm:w-6 text-fuchsia-500/75 dark:text-fuchsia-300/80 [filter:drop-shadow(0_0_8px_rgba(217,70,239,0.45))]" />
        <NeonShape kind="star" className="absolute left-[16%] top-[60%] h-6 w-6 sm:h-8 sm:w-8 text-violet-500/75 dark:text-violet-300/80 [filter:drop-shadow(0_0_8px_rgba(139,92,246,0.45))]" />
        <NeonShape kind="butterfly" className="absolute left-[9%] top-[78%] hidden h-6 w-6 sm:h-8 sm:w-8 text-pink-500/75 dark:text-pink-300/80 [filter:drop-shadow(0_0_8px_rgba(236,72,153,0.45))] sm:block" />

        <NeonShape kind="star" className="absolute right-[9%] top-[16%] h-6 w-6 sm:h-8 sm:w-8 text-sky-500/75 dark:text-cyan-300/80 [filter:drop-shadow(0_0_8px_rgba(14,165,233,0.45))]" />
        <NeonShape kind="star" className="absolute right-[14%] top-[32%] h-5 w-5 sm:h-6 sm:w-6 text-cyan-500/75 dark:text-sky-300/80 [filter:drop-shadow(0_0_8px_rgba(6,182,212,0.45))]" />
        <NeonShape kind="heart" className="absolute right-[11%] top-[56%] h-6 w-6 sm:h-8 sm:w-8 text-rose-500/75 dark:text-rose-300/80 [filter:drop-shadow(0_0_8px_rgba(244,63,94,0.45))]" />
        <NeonShape kind="butterfly" className="absolute right-[16%] top-[74%] hidden h-6 w-6 sm:h-8 sm:w-8 text-amber-500/75 dark:text-amber-300/80 [filter:drop-shadow(0_0_8px_rgba(245,158,11,0.45))] sm:block" />

        <NeonShape kind="star" className="absolute left-[39%] top-[14%] hidden h-5 w-5 text-violet-500/60 dark:text-violet-300/65 md:block [filter:drop-shadow(0_0_6px_rgba(139,92,246,0.4))]" />
        <NeonShape kind="heart" className="absolute left-[33%] top-[82%] hidden h-5 w-5 text-pink-500/60 dark:text-pink-300/65 md:block [filter:drop-shadow(0_0_6px_rgba(236,72,153,0.4))]" />
        <NeonShape kind="star" className="absolute right-[35%] top-[12%] hidden h-5 w-5 text-sky-500/60 dark:text-cyan-300/65 md:block [filter:drop-shadow(0_0_6px_rgba(14,165,233,0.4))]" />
        <NeonShape kind="butterfly" className="absolute right-[30%] top-[84%] hidden h-5 w-5 text-fuchsia-500/60 dark:text-fuchsia-300/65 md:block [filter:drop-shadow(0_0_6px_rgba(217,70,239,0.4))]" />
      </div>

      <div className="relative z-10">
      <section className="paper-stage pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="paper-surface px-6 md:px-10 py-8 text-center">
            <p className="text-cream-50/80 text-sm tracking-[0.18em] uppercase">El Yapımı Çiçek Koleksiyonu</p>
            <h1
              className="text-3xl md:text-4xl font-semibold tracking-tight text-cream-50 mt-2 antialiased [text-rendering:geometricPrecision]"
              style={{ fontFamily: "var(--font-brand)" }}
            >
              Ürün Detayı
            </h1>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-14 flex flex-col min-h-screen">
        {/* Breadcrumb */}
        <div className="flex min-w-0 flex-wrap items-center gap-2 text-sage-500 dark:text-sage-400 text-sm mb-8">
          <Link href="/" className="hover:text-sage-800 dark:hover:text-cream-50 transition-colors">Ana Sayfa</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/katalog" className="hover:text-sage-800 dark:hover:text-cream-50 transition-colors">Katalog</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="min-w-0 max-w-full truncate text-sage-800 dark:text-cream-50 font-medium">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-12 lg:gap-24 mb-12 md:mb-24">
          {/* Gallery */}
          <div className="relative">
            <ProductImageGallery images={product.images} alt={product.name} />
            {!product.inStock && (
              <div className="absolute top-6 left-6 z-10 bg-white dark:bg-slate-950 px-4 py-2 rounded-full font-bold text-rose-500 shadow-sm">
                Tükendi
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center bg-cream-50 dark:bg-slate-950 p-6 md:p-10 rounded-3xl transition-colors duration-700 ease-in-out">
            <div className="mb-2 text-rose-500 font-medium tracking-widest uppercase text-sm">
              {product.category.replace(/-/g, " ")}
            </div>
            <h1 className="font-serif text-4xl lg:text-5xl text-sage-800 dark:text-cream-50 mb-6 leading-tight transition-colors">
              {product.name}
            </h1>
            <p className="text-3xl text-sage-500 dark:text-sage-300 font-light mb-8 transition-colors">
              {product.price} <span className="text-2xl">₺</span>
            </p>

            <div className="space-y-4 mb-8 text-sage-800/80 dark:text-cream-50/80 leading-relaxed text-lg font-light transition-colors border-l-4 border-sage-200 dark:border-slate-800 pl-4">
              <p>{product.description}</p>
            </div>

            <ul className="space-y-4 mb-10 text-base text-sage-600 dark:text-sage-400 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-sage-100 dark:border-slate-800 transition-colors duration-700 ease-in-out shadow-sm">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-sage-800 dark:text-cream-50" />
                <span className="font-medium text-sage-800 dark:text-cream-50">El Yapımı İşçilik</span>
              </li>
              <li className="flex items-center gap-3">
                <Truck className="w-6 h-6 text-sage-800 dark:text-cream-50" />
                <span className="font-medium text-sage-800 dark:text-cream-50">Korunaklı Paketleme ve Özenli Teslimat</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-sage-800 dark:text-cream-50" />
                <span className="font-medium text-sage-800 dark:text-cream-50">Teslimat Türkiye geneline yapılır.</span>
              </li>
            </ul>

            <div className="flex flex-col gap-4 w-full lg:w-[400px]">
              <a
                 href={instagramUrl}
                 target="_blank"
                 rel="noopener noreferrer"
                 className={`flex items-center justify-center gap-3 w-full px-8 py-5 rounded-2xl font-medium tracking-wide text-lg transition-all duration-700 ease-in-out shadow-md ${
                   product.inStock
                     ? "bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white hover:opacity-90 hover:-translate-y-1 hover:shadow-xl"
                     : "bg-sage-200 dark:bg-slate-800 text-sage-500 dark:text-slate-500 cursor-not-allowed pointer-events-none"
                 }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
                {product.inStock ? "Instagram'dan Sipariş Ver" : "Stokta Yok"}
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-3 w-full px-8 py-5 rounded-2xl font-medium tracking-wide text-lg transition-all duration-700 ease-in-out shadow-md ${
                  product.inStock
                    ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 text-white hover:opacity-90 hover:-translate-y-1 hover:shadow-xl"
                    : "bg-sage-100 dark:bg-slate-800 border-sage-200 dark:border-slate-700 text-sage-500 dark:text-slate-500 cursor-not-allowed pointer-events-none"
                }`}
              >
                <WhatsAppLogo className="w-6 h-6" />
                {product.inStock ? "WhatsApp'tan Sipariş Ver" : "Stokta Yok"}
              </a>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
