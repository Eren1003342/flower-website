import Image from "next/image";
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
        <div className="relative w-full aspect-[21/9] rounded-3xl overflow-hidden mb-10 shadow-xl dark:shadow-slate-800/20">
          <Image
            src={content.about.heroImage}
            alt="Atölyemiz"
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover"
          />
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
