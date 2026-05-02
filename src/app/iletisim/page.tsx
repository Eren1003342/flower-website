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

export default async function ContactPage() {
  const content = await getSiteContent();
  const instagramHandle = content.contact.instagram.replace(/^@/, "");
  const instagramUrl = `https://instagram.com/${instagramHandle}`;
  const whatsappDisplay = "+90 501 350 22 09";
  const whatsappUrl = "https://wa.me/905013502209";
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(content.contact.address)}`;

  return (
    <div className="w-full bg-[#050a24] transition-colors">
      <section className="paper-stage pt-20 pb-14">
        <div className="max-w-6xl mx-auto px-4">
          <div className="paper-surface px-6 md:px-10 py-10 md:py-12 text-center">
            <h1 className="text-5xl font-bold text-cream-50 mb-4" style={{ fontFamily: "var(--font-brand)" }}>{content.contact.title}</h1>
            <p className="text-cream-50/90 max-w-2xl mx-auto text-lg font-medium">{content.contact.subtitle}</p>
            <p className="mt-4 inline-flex items-center justify-center rounded-full border border-amber-200/40 bg-amber-100/15 px-4 py-2 text-sm font-semibold text-amber-100">
              Sipariş ve teslimat yalnızca Bursa içindedir.
            </p>
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
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-6 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70"
              >
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-cream-50 transition-colors">
                  <WhatsAppLogo className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-lg mb-1 text-slate-800 dark:text-cream-50">WhatsApp</p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-semibold group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                    {whatsappDisplay}
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
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-emerald-500 text-white px-4 py-2 text-sm font-semibold hover:bg-emerald-600 transition-all w-full sm:w-auto"
          >
            WhatsApp&apos;tan Yaz
          </a>
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
          <p className="font-semibold mt-1">Instagram ve WhatsApp üzerinden sipariş</p>
        </div>
        <div className="rounded-2xl bg-slate-900/90 border border-slate-700 p-4 text-slate-200 md:col-span-3">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Teslimat Bölgesi</p>
          <p className="font-semibold mt-1">Yalnızca Bursa içi sipariş ve teslimat hizmeti veriyoruz.</p>
        </div>
      </div>
    </div>
    </div>
  );
}
