import type { SiteContent } from "@/lib/cms";

export default function Footer({ content }: { content: SiteContent }) {
  return (
    <footer className="bg-sage-800 dark:bg-slate-900 border-t dark:border-slate-800 text-sage-100 py-12 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div>
          <h2 className="font-serif text-2xl font-semibold mb-4 text-cream-50">{content.brand.name}</h2>
          <p className="text-sage-200">{content.footer.description}</p>
        </div>
        <div>
          <h3 className="font-serif text-xl mb-4 text-rose-200">Menü</h3>
          <ul className="space-y-2">
            <li><a href="/katalog" className="hover:text-white transition-colors">Ürünler</a></li>
            <li><a href="/hakkimizda" className="hover:text-white transition-colors">Hakkımızda</a></li>
            <li><a href="/iletisim" className="hover:text-white transition-colors">İletişim</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-serif text-xl mb-4 text-rose-200">İletişim</h3>
          <p className="mb-2">📍 {content.contact.address}</p>
          <p>📷 {content.contact.instagram}</p>
        </div>
      </div>
      <div className="text-center text-sage-500 text-sm mt-12 mb-4 border-t border-sage-500/30 pt-8">
        © {new Date().getFullYear()} {content.brand.name}. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
