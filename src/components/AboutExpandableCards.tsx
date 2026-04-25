"use client";

import { useState } from "react";

export default function AboutExpandableCards({ paragraphs }: { paragraphs: string[] }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="grid sm:grid-cols-2 gap-3 w-full">
      {paragraphs.map((paragraph, index) => {
        const isExpanded = expandedIndex === index;
        return (
          <button
            key={index}
            type="button"
            onClick={() => setExpandedIndex((prev) => (prev === index ? null : index))}
            className="cursor-pointer text-left rounded-2xl border border-sage-200 dark:border-slate-700 bg-cream-50/70 dark:bg-slate-800/70 p-4 transition-all hover:border-sage-300 dark:hover:border-slate-500"
          >
            <p className={`text-sm text-sage-700 dark:text-sage-200 leading-relaxed ${isExpanded ? "" : "line-clamp-4"}`}>
              {paragraph}
            </p>
            <span className="mt-3 inline-block text-xs font-semibold text-sage-600 dark:text-sage-300">
              {isExpanded ? "Küçült" : "Devamını Gör"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
