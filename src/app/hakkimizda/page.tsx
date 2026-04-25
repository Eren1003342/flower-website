import { getSiteContent } from "@/lib/cms";

export default async function AboutPage() {
  const content = await getSiteContent();

  return (
    <div className="w-full bg-cream-50 dark:bg-slate-950 transition-colors">
      <section className="paper-stage pt-20 pb-14">
        <div className="max-w-5xl mx-auto px-4">
          <div className="paper-surface px-6 md:px-10 py-10 md:py-12 text-center">
            <h1 className="text-5xl font-bold text-cream-50 mb-4" style={{ fontFamily: "var(--font-brand)" }}>{content.about.title}</h1>
            <p className="text-cream-50/90 text-lg max-w-2xl mx-auto font-medium">{content.about.subtitle}</p>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-14 md:py-16">
        <div className="rounded-3xl border border-sage-200 dark:border-slate-700 bg-gradient-to-br from-cream-50 via-white to-rose-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-6 md:p-8 mb-10 shadow-xl dark:shadow-slate-800/20">
          <p className="text-xs uppercase tracking-[0.2em] text-sage-600 dark:text-sage-300 mb-4">Nasıl Çalışıyoruz?</p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-sage-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 p-4">
              <p className="font-semibold text-sage-900 dark:text-cream-50">Kişiye Özel Tasarım</p>
              <p className="text-sm text-sage-600 dark:text-sage-300 mt-1">
                Renk, model ve konsepti siparişe özel olarak birlikte belirliyoruz.
              </p>
            </div>
            <div className="rounded-2xl border border-sage-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 p-4">
              <p className="font-semibold text-sage-900 dark:text-cream-50">Özel Gün Planı</p>
              <p className="text-sm text-sage-600 dark:text-sage-300 mt-1">
                Doğum günü, söz, nişan ve yıldönümü için hazır paketler sunuyoruz.
              </p>
            </div>
            <div className="rounded-2xl border border-sage-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 p-4">
              <p className="font-semibold text-sage-900 dark:text-cream-50">Hızlı İletişim</p>
              <p className="text-sm text-sage-600 dark:text-sage-300 mt-1">
                Instagram ve e-posta üzerinden hızlı geri dönüşle sipariş sürecini başlatıyoruz.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/85 dark:bg-slate-900/85 rounded-3xl p-7 md:p-10 shadow-lg border border-sage-100 dark:border-slate-800">
          <h2 className="text-3xl md:text-4xl font-semibold text-sage-900 dark:text-cream-50 mb-5" style={{ fontFamily: "var(--font-brand)" }}>
            {content.about.intro}
          </h2>
          <div className="space-y-5 text-sage-600 dark:text-sage-300 leading-relaxed text-lg">
            {content.about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
