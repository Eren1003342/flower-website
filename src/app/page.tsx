import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import MobileHeroCarousel from "@/components/MobileHeroCarousel";
import AboutExpandableCards from "@/components/AboutExpandableCards";
import { ArrowRight, Flower2, Sparkles, Truck, ShieldCheck } from "lucide-react";
import { getProducts, getSiteContent } from "@/lib/cms";

export default async function Home() {
  const [featuredProducts, content] = await Promise.all([getProducts(), getSiteContent()]);
  const heroLines = content.home.heroTitle.split("\n");
  const heroBadgeLabel = content.home.heroBadge.replace(/atelier/gi, "Atölyesi");
  const aboutLines = content.home.aboutTitle.split("\n");
  const previewProducts = featuredProducts.slice(0, 8);
  const heroShowcase = featuredProducts.slice(0, 3);
  const mobileHeroItems = featuredProducts.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: product.images?.[0] ?? "/placeholder-flower.svg",
  }));
  const categoryCards = (content.home.showcaseCategories.length > 0
    ? content.home.showcaseCategories
    : [
        { id: "buket", label: "Buketler" },
        { id: "saksi", label: "Saksı Çiçekleri" },
        { id: "kuru-cicek", label: "Kuru Çiçekler" },
        { id: "ozel-gun", label: "Özel Gün Tasarımları" },
      ]
  ).map((category) => {
    const product = featuredProducts.find((item) => item.category === category.id);
    return {
      ...category,
      href: product ? `/urun/${product.slug}` : "/katalog",
      image: product?.images?.[0] ?? "/placeholder-flower.svg",
      productName: product?.name ?? "Koleksiyonu İncele",
    };
  });
  const bestSeller = featuredProducts[0];
  const newSeason = featuredProducts[1];
  const quickOrder = featuredProducts[2];

  return (
    <div className="flex flex-col w-full bg-[#040924]">
      <section className="relative overflow-hidden">
        <Image
          src={content.home.heroImage}
          alt="Ana ekran çiçek arka planı"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#050a24]/75" />
        <div className="absolute inset-0 opacity-80 bg-[radial-gradient(circle_at_10%_10%,rgba(226,141,134,0.28),transparent_36%),radial-gradient(circle_at_90%_15%,rgba(250,228,123,0.18),transparent_32%),radial-gradient(circle_at_70%_80%,rgba(123,142,128,0.24),transparent_38%)]" />
        <div className="absolute inset-0 brick-texture opacity-15" />

        <div className="relative z-10">
          <section className="w-full px-4 pt-7 sm:pt-10 md:pt-14 pb-10">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
              <div className="rounded-[2rem] border border-white/15 bg-white/10 backdrop-blur-md p-5 sm:p-6 md:p-9 text-cream-50 shadow-2xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cream-50/25 bg-white/10 px-4 py-2 text-xs md:text-sm tracking-[0.18em] uppercase text-cream-50/90">
                  <Sparkles className="w-4 h-4" />
                  {heroBadgeLabel}
                </div>
                <h1 className="font-serif text-[2.15rem] sm:text-5xl lg:text-6xl leading-[1.05] mb-4 sm:mb-5" style={{ fontFamily: "var(--font-playfair)" }}>
                  {heroLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h1>
                <p className="hidden sm:block text-base sm:text-lg text-cream-50/85 max-w-2xl leading-relaxed mb-5 sm:mb-8">
                  {content.home.heroSubtitle}
                </p>

                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mb-7 sm:mb-8">
                  <Link href="/katalog" className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-cream-50 text-slate-900 px-7 py-3.5 rounded-full font-semibold shadow-xl hover:-translate-y-0.5 transition-all">
                    {content.home.heroPrimaryCta} <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/iletisim" className="inline-flex items-center justify-center gap-2 w-full sm:w-auto border border-cream-50/35 text-cream-50 px-7 py-3.5 rounded-full font-medium hover:bg-cream-50/10 transition-colors">
                    {content.home.heroSecondaryCta}
                  </Link>
                </div>
                <div className="mb-6 inline-flex items-center rounded-full border border-amber-200/40 bg-amber-100/15 px-4 py-2 text-xs sm:text-sm font-semibold text-amber-100">
                  Bursa içi elden teslim, diğer illere kargo mevcuttur.
                </div>

                <MobileHeroCarousel items={mobileHeroItems} />

                <div className="hidden sm:grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 lg:mt-0">
                  <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                    <div className="text-[10px] sm:text-sm uppercase tracking-[0.16em] text-cream-50/70">Koleksiyon</div>
                    <div className="text-[13px] sm:text-lg font-semibold mt-1 leading-tight">El Yapımı Buketler</div>
                  </div>
                  <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                    <div className="text-[10px] sm:text-sm uppercase tracking-[0.16em] text-cream-50/70">Teslimat</div>
                    <div className="text-[13px] sm:text-lg font-semibold mt-1 leading-tight">Aynı Gün Planlama</div>
                  </div>
                  <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                    <div className="text-[10px] sm:text-sm uppercase tracking-[0.16em] text-cream-50/70">Atölye</div>
                    <div className="text-[13px] sm:text-lg font-semibold mt-1 leading-tight">Butik Tasarım</div>
                  </div>
                </div>
              </div>

              <div className="hidden lg:grid md:grid-rows-3 gap-3 overflow-x-auto md:overflow-visible hide-scrollbar pb-1 md:pb-0">
                {heroShowcase.map((product, index) => (
                  <Link key={product.id} href={`/urun/${product.slug}`} className="group rounded-3xl overflow-hidden border border-white/20 bg-white/10 backdrop-blur-sm min-h-[130px] min-w-[78vw] sm:min-w-[48vw] md:min-w-0 relative">
                    <Image
                      src={product.images?.[0] ?? "/placeholder-flower.svg"}
                      alt={product.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/20 to-transparent" />
                    <div className="absolute inset-0 p-4 flex flex-col justify-end">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-cream-50/80 mb-1">{index === 0 ? "En Çok Satan" : index === 1 ? "Yeni Sezon" : "Özel Tasarım"}</p>
                      <p className="text-base font-medium text-cream-50 line-clamp-1">{product.name}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="max-w-6xl mx-auto px-4 w-full mt-2 lg:hidden pb-6">
            <div className="rounded-3xl border border-sage-200/80 dark:border-white/15 bg-cream-50/90 dark:bg-white/10 backdrop-blur-md shadow-2xl p-4">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="font-serif text-xl text-sage-900 dark:text-cream-50">Kategori Vitrini</h2>
                <Link href="/katalog" className="text-rose-600 dark:text-rose-300 hover:text-rose-700 dark:hover:text-rose-200 transition-colors text-xs font-semibold tracking-wide uppercase">
                  Tümünü Gör
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {categoryCards.slice(0, 4).map((card) => (
                  <Link key={`mobile-${card.id}-${card.label}`} href={card.href} className="group">
                    <div className="relative min-h-[128px] rounded-2xl overflow-hidden border border-sage-200/90 dark:border-white/20 bg-white/70 dark:bg-black/20 p-3">
                      <div className="absolute inset-0">
                        <Image
                          src={card.image}
                          alt={card.label}
                          fill
                          sizes="(max-width: 768px) 50vw, 200px"
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/5" />
                      <div className="relative z-10 h-full flex flex-col justify-end">
                        <p className="text-sm font-semibold text-cream-50 line-clamp-1">{card.label}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="hidden lg:block max-w-6xl mx-auto px-4 w-full mt-8 pb-8">
            <div className="bg-cream-50/92 dark:bg-slate-950/85 rounded-3xl border border-sage-200/80 dark:border-slate-700/70 shadow-2xl p-5 md:p-6">
              <div className="flex items-center justify-between gap-4 mb-5">
                <h2 className="font-serif text-2xl md:text-3xl text-sage-900 dark:text-cream-50">Kategori Vitrini</h2>
                <Link href="/katalog" className="text-rose-600 dark:text-rose-300 hover:text-rose-700 dark:hover:text-rose-200 transition-colors text-sm font-medium">
                  Tümünü Gör
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categoryCards.map((card) => (
                  <Link key={`${card.id}-${card.label}`} href={card.href} className="group">
                    <div className="rounded-2xl border border-sage-200 dark:border-slate-700 bg-white/95 dark:bg-slate-950 p-3 text-center">
                      <div className="relative mx-auto w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-sage-300 dark:border-slate-700 shadow-md">
                        <Image src={card.image} alt={card.label} fill sizes="128px" className="object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-sage-900 dark:text-cream-50">{card.label}</p>
                      <p className="mt-1 text-xs text-sage-600 dark:text-slate-300 line-clamp-1">{card.productName}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="max-w-6xl mx-auto px-4 w-full pb-10">
            <div className="grid lg:grid-cols-[1.3fr_1fr] gap-4">
              <Link href={bestSeller ? `/urun/${bestSeller.slug}` : "/katalog"} className="group relative min-h-[320px] rounded-3xl overflow-hidden border border-slate-700">
                <Image
                  src={bestSeller?.images?.[0] ?? "/placeholder-flower.svg"}
                  alt={bestSeller?.name ?? "En Çok Satan"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-transparent" />
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end text-cream-50">
                  <p className="text-xs uppercase tracking-[0.2em] mb-2">Kampanya</p>
                  <h3 className="text-3xl md:text-4xl font-semibold leading-tight" style={{ fontFamily: "var(--font-brand)" }}>
                    En Çok Tercih Edilen Tasarımlar
                  </h3>
                  <p className="mt-2 text-cream-50/80 max-w-md">{bestSeller?.name ?? "Bugünün en sevilen buketlerini inceleyin."}</p>
                </div>
              </Link>

              <div className="grid sm:grid-rows-2 gap-4">
                <Link href={newSeason ? `/urun/${newSeason.slug}` : "/katalog"} className="group relative min-h-[152px] rounded-3xl overflow-hidden border border-slate-700">
                  <Image src={newSeason?.images?.[0] ?? "/placeholder-flower.svg"} alt={newSeason?.name ?? "Yeni Sezon"} fill sizes="(max-width:1024px) 100vw, 33vw" className="object-cover opacity-85 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/35" />
                  <div className="absolute inset-0 p-5 flex items-end text-cream-50">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em]">Yeni Sezon</p>
                      <p className="font-serif text-2xl">{newSeason?.name ?? "Canlı Renkler"}</p>
                    </div>
                  </div>
                </Link>
                <Link href={quickOrder ? `/urun/${quickOrder.slug}` : "/iletisim"} className="group relative min-h-[152px] rounded-3xl overflow-hidden border border-slate-700">
                  <Image src={quickOrder?.images?.[0] ?? "/placeholder-flower.svg"} alt={quickOrder?.name ?? "Hızlı Sipariş"} fill sizes="(max-width:1024px) 100vw, 33vw" className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/35" />
                  <div className="absolute inset-0 p-5 flex items-end text-cream-50">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em]">Hızlı Sipariş</p>
                      <p className="font-serif text-2xl">Aynı Gün Tasarım Planı</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </section>

          <section className="hidden md:flex max-w-6xl mx-auto px-4 w-full pb-14 justify-center">
            <div className="w-full md:w-[920px] rounded-3xl border border-sage-200 dark:border-slate-700 bg-white/95 dark:bg-slate-950/90 shadow-2xl p-5 md:p-7">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-cream-50 dark:bg-slate-900 border border-sage-100 dark:border-slate-800 p-4 flex items-start gap-3">
                  <Flower2 className="w-5 h-5 text-rose-500 mt-1" />
                  <div>
                    <p className="font-semibold text-sage-900 dark:text-cream-50">Butik Üretim</p>
                    <p className="text-sm text-sage-600 dark:text-slate-300">Her tasarım elde hazırlanır.</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-cream-50 dark:bg-slate-900 border border-sage-100 dark:border-slate-800 p-4 flex items-start gap-3">
                  <Truck className="w-5 h-5 text-rose-500 mt-1" />
                  <div>
                    <p className="font-semibold text-sage-900 dark:text-cream-50">Bursa Elden, Diğer İllere Kargo</p>
                    <p className="text-sm text-sage-600 dark:text-slate-300">Bursa içi elden teslim, diğer illere güvenli kargo gönderimi yapılır.</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-cream-50 dark:bg-slate-900 border border-sage-100 dark:border-slate-800 p-4 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-rose-500 mt-1" />
                  <div>
                    <p className="font-semibold text-sage-900 dark:text-cream-50">Güvenli Sipariş</p>
                    <p className="text-sm text-sage-600 dark:text-slate-300">Instagram ve e-posta ile hızlı iletişim.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="w-full bg-cream-50 dark:bg-slate-950 transition-colors py-12 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 w-full">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <h2 className="text-4xl font-bold text-sage-900 dark:text-cream-50 mb-2 transition-colors" style={{ fontFamily: "var(--font-brand)" }}>
                {content.home.featuredTitle}
              </h2>
              <p className="text-sage-700 dark:text-sage-300 transition-colors font-medium">{content.home.featuredSubtitle}</p>
            </div>
            <Link href="/katalog" className="text-rose-500 font-medium hover:text-rose-800 dark:hover:text-rose-400 transition-colors flex items-center gap-1 group pb-2">
              Tümünü Gör <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {previewProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sage-200/65 dark:bg-slate-900 transition-colors duration-300 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="rounded-3xl border border-sage-300/60 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-6 md:p-10 shadow-xl dark:shadow-slate-950/30">
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 md:gap-10 items-start">
              <div className="flex flex-col gap-5 md:gap-6 items-start">
                <div className="text-sage-700 dark:text-sage-300 font-semibold tracking-widest uppercase text-sm">{content.home.aboutKicker}</div>
                <h2
                  className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-sage-900 dark:text-cream-50 transition-colors leading-tight"
                  style={{ fontFamily: "var(--font-brand)" }}
                >
                  {aboutLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h2>
                <p className="text-sage-800/90 dark:text-sage-200 transition-colors leading-relaxed text-base sm:text-lg font-medium">
                  {content.home.aboutDescription}
                </p>
                <AboutExpandableCards paragraphs={content.about.paragraphs.slice(0, 2)} />
                <Link
                  href="/hakkimizda"
                  className="mt-2 border-b border-sage-900 dark:border-cream-50 pb-1 text-sage-900 dark:text-cream-50 font-semibold hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-600 dark:hover:border-rose-400 transition-colors"
                >
                  {content.home.aboutLink}
                </Link>
              </div>

              <div className="rounded-3xl border border-sage-200 dark:border-slate-700 bg-gradient-to-br from-sage-100/70 via-cream-50/70 to-rose-100/55 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 p-5 md:p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-sage-600 dark:text-sage-300 mb-3">Neden Eleanor Çiçek?</p>
                <div className="space-y-3">
                  <div className="rounded-2xl bg-white/75 dark:bg-slate-900/80 border border-sage-200 dark:border-slate-700 p-4">
                    <p className="text-sm font-semibold text-sage-800 dark:text-cream-50">Instagram Odaklı Satış</p>
                    <p className="text-sm text-sage-600 dark:text-sage-300 mt-1">Tüm sipariş süreci hızlıca Instagram DM üzerinden ilerler.</p>
                  </div>
                  <div className="rounded-2xl bg-white/75 dark:bg-slate-900/80 border border-sage-200 dark:border-slate-700 p-4">
                    <p className="text-sm font-semibold text-sage-800 dark:text-cream-50">Kişiye Özel Konseptler</p>
                    <p className="text-sm text-sage-600 dark:text-sage-300 mt-1">Doğum günü, yıldönümü ve özel günlere uygun tasarım önerileri.</p>
                  </div>
                  <div className="rounded-2xl bg-white/75 dark:bg-slate-900/80 border border-sage-200 dark:border-slate-700 p-4">
                    <p className="text-sm font-semibold text-sage-800 dark:text-cream-50">Kalıcı Hatıra Etkisi</p>
                    <p className="text-sm text-sage-600 dark:text-sage-300 mt-1">Uzun ömürlü çiçek koleksiyonlarıyla duyguyu kalıcı hale getirir.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}