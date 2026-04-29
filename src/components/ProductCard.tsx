import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/cms";

export default function ProductCard({ product }: { product: Product }) {
  const imageUrl =
    product.images && product.images[0] ? product.images[0] : "/placeholder-flower.svg";
  return (
    <Link href={`/urun/${product.slug}`} className="group block">
      <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md dark:shadow-slate-800/50 ring-1 ring-slate-100 dark:ring-slate-800/80 transition-all duration-300 relative aspect-[4/5] mb-3 sm:mb-4">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {!product.inStock && (
          <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-950/90 px-3 py-1 rounded-full text-xs font-semibold text-rose-500">
            Tükendi
          </div>
        )}
      </div>
      <div>
        <h3 className="font-sans text-[1rem] sm:text-[1.05rem] font-semibold tracking-tight text-slate-800 dark:text-cream-50 mb-1 group-hover:text-sage-600 transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sage-700 dark:text-sage-200 font-semibold text-[0.95rem] sm:text-base">{product.price} ₺</p>
      </div>
    </Link>
  );
}
