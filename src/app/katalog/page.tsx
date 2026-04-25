import { getProducts, getSiteContent } from "@/lib/cms";
import CatalogBrowser from "@/components/CatalogBrowser";

export default async function KatalogPage() {
  const [products, content] = await Promise.all([getProducts(), getSiteContent()]);

  return (
    <div className="w-full bg-cream-50 dark:bg-slate-950 transition-colors">
      <section className="paper-stage pt-20 pb-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="paper-surface px-6 md:px-10 py-10 md:py-12 text-center">
            <h1 className="text-5xl font-bold text-cream-50 transition-colors mb-4" style={{ fontFamily: "var(--font-brand)" }}>
              {content.home.featuredTitle}
            </h1>
            <p className="text-cream-50/90 transition-colors max-w-2xl mx-auto text-lg font-medium">
              {content.home.featuredSubtitle}
            </p>
          </div>
        </div>
      </section>

      <CatalogBrowser products={products} options={content.home.catalogFilters} />
    </div>
  );
}
