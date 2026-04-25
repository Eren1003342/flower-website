import { Mail, MapPin } from "lucide-react";
import { getSiteContent } from "@/lib/cms";

function InstagramLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.8" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
    </svg>
  );
}

export default async function ContactPage() {
  const content = await getSiteContent();
  const instagramHandle = content.contact.instagram.replace(/^@/, "");
  const instagramUrl = `https://instagram.com/${instagramHandle}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(content.contact.address)}`;

  return (
    <div className="w-full bg-[#050a24] transition-colors">
      <section className="paper-stage pt-20 pb-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="paper-surface px-6 md:px-10 py-10 md:py-12 text-center">
            <h1 className="text-5xl font-bold text-cream-50 mb-4" style={{ fontFamily: "var(--font-brand)" }}>{content.contact.title}</h1>
            <p className="text-cream-50/90 max-w-2xl mx-auto text-lg font-medium">{content.contact.subtitle}</p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10 md:py-14 min-h-[70vh] bg-gradient-to-b from-slate-900/30 to-transparent rounded-t-3xl">

      <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-24 mb-14 md:mb-24 items-start">
        {/* Contact Info */}
        <div className="bg-white/95 dark:bg-slate-900 rounded-3xl p-6 sm:p-8 md:p-14 shadow-xl border border-sage-100 dark:border-slate-800 flex flex-col justify-center h-full transition-colors">
          <ul className="space-y-8 text-sage-900 dark:text-cream-50">
            <li className="group">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-6 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500/70"
              >
                <div className="w-14 h-14 bg-sage-100 dark:bg-slate-800 text-sage-800 dark:text-cream-50 rounded-2xl flex items-center justify-center group-hover:bg-sage-700 dark:group-hover:bg-sage-500 group-hover:text-cream-50 transition-colors">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-lg mb-1 text-slate-800 dark:text-cream-50">{content.contact.addressLabel}</p>
                  <p className="text-slate-700 dark:text-sage-300 font-medium">{content.contact.address}</p>
                </div>
              </a>
            </li>
            
            <li className="group">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-6 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/70"
              >
                <div className="w-14 h-14 bg-[#fce4ec] dark:bg-rose-950/50 text-[#d62976] rounded-2xl flex items-center justify-center group-hover:bg-[#d62976] group-hover:text-cream-50 transition-colors">
                  <InstagramLogo className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-lg mb-1 text-slate-800 dark:text-cream-50">{content.contact.instagramLabel}</p>
                  <p className="text-[#d62976] dark:text-rose-400 font-semibold group-hover:text-[#bc2a8d] dark:group-hover:text-rose-300 transition-colors">
                    {content.contact.instagram}
                  </p>
                </div>
              </a>
            </li>

            <li className="group">
              <a
                href={`mailto:${content.contact.email}`}
                className="flex items-center gap-6 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-500/70"
              >
                <div className="w-14 h-14 bg-sage-100 dark:bg-slate-800 text-sage-800 dark:text-cream-50 rounded-2xl flex items-center justify-center group-hover:bg-sage-700 dark:group-hover:bg-sage-500 group-hover:text-cream-50 transition-colors">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-lg mb-1 text-slate-800 dark:text-cream-50">{content.contact.emailLabel}</p>
                  <p className="text-slate-700 dark:text-sage-300 font-medium hover:text-sage-700 dark:hover:text-cream-50 transition-colors">{content.contact.email}</p>
                </div>
              </a>
            </li>
          </ul>
        </div>

        {/* Map */}
        <div className="h-full min-h-[300px] md:min-h-[400px] w-full rounded-3xl overflow-hidden shadow-xl border border-sage-100 dark:border-slate-800">
          <iframe
            src={content.contact.mapEmbed}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full object-cover"
          ></iframe>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-700 bg-slate-950/90 p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-cream-50" style={{ fontFamily: "var(--font-brand)" }}>Hızlı Sipariş Desteği</h2>
          <p className="text-slate-300 mt-1">Özel ölçü ve renk tercihinizi Instagram DM veya e-posta ile iletin.</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 w-full md:w-auto">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white px-4 py-2 text-sm font-semibold hover:opacity-90 transition-all w-full sm:w-auto"
          >
            Instagram&apos;dan Yaz
          </a>
          <a
            href={`mailto:${content.contact.email}`}
            className="inline-flex items-center justify-center rounded-full border border-slate-500 text-slate-100 px-4 py-2 text-sm font-semibold hover:bg-slate-800 transition-all w-full sm:w-auto"
          >
            E-Posta Gönder
          </a>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3 mb-10">
        <div className="rounded-2xl bg-slate-900/90 border border-slate-700 p-4 text-slate-200">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Cevap Süresi</p>
          <p className="font-semibold mt-1">Genelde 5-15 dakika</p>
        </div>
        <div className="rounded-2xl bg-slate-900/90 border border-slate-700 p-4 text-slate-200">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Sipariş Tipi</p>
          <p className="font-semibold mt-1">Kişiye özel tasarım</p>
        </div>
        <div className="rounded-2xl bg-slate-900/90 border border-slate-700 p-4 text-slate-200">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Satış Kanalı</p>
          <p className="font-semibold mt-1">Instagram üzerinden sipariş</p>
        </div>
      </div>
    </div>
    </div>
  );
}
