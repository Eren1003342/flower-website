"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import ProductCard from "./ProductCard";
import type { Category, CategoryDisplayOption, Product } from "@/lib/cms";

const DEFAULT_CATEGORIES: { id: Category | "hepsi"; label: string }[] = [
  { id: "hepsi", label: "Tüm Ürünler" },
  { id: "buket", label: "Buketler" },
  { id: "saksi", label: "Saksı Çiçekleri" },
  { id: "kuru-cicek", label: "Kuru Çiçek" },
  { id: "ozel-gun", label: "Özel Günler" },
];

export default function CatalogBrowser({
  products,
  options,
}: {
  products: Product[];
  options: CategoryDisplayOption[];
}) {
  const [activeCategory, setActiveCategory] = useState<Category | "hepsi">("hepsi");
  const [searchQuery, setSearchQuery] = useState("");
  const categories: { id: Category | "hepsi"; label: string }[] =
    options.length > 0 ? [{ id: "hepsi", label: "Tüm Ürünler" }, ...options] : DEFAULT_CATEGORIES;

  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategory === "hepsi" || product.category === activeCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full bg-cream-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-14 flex flex-col min-h-[60vh]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 z-10 w-full">
          <div className="flex flex-wrap items-center gap-2 lg:gap-4 overflow-x-auto w-full md:w-auto pb-4 md:pb-0 hide-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "bg-sage-800 dark:bg-sage-500 text-cream-50 shadow-md"
                    : "bg-white dark:bg-slate-900 border border-sage-200 dark:border-slate-800 text-sage-500 dark:text-sage-300 hover:bg-sage-100 dark:hover:bg-slate-800 hover:text-sage-800 dark:hover:text-cream-50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64 flex-shrink-0">
            <input
              type="text"
              placeholder="Ürün veya tasarım ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-sage-200 dark:border-slate-800 text-sage-800 dark:text-cream-50 rounded-full pl-11 pr-4 py-2.5 outline-none focus:border-sage-500 dark:focus:border-sage-500 focus:ring-1 focus:ring-sage-500 transition-all placeholder:text-sage-300 dark:placeholder:text-slate-500"
            />
            <Search className="w-5 h-5 text-sage-300 dark:text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-20 text-sage-500 dark:text-sage-400 border-2 border-dashed border-sage-200 dark:border-slate-800 rounded-3xl">
            <Search className="w-12 h-12 mb-4 opacity-50" />
            <h3 className="font-serif text-2xl text-sage-800 dark:text-cream-50 mb-2">Sonuç Bulunamadı</h3>
            <p className="max-w-md">Arama kriterlerinize uygun el yapımı tasarım bulamadık. Lütfen başka bir kelime deneyin.</p>
          </div>
        )}
      </div>
    </div>
  );
}
