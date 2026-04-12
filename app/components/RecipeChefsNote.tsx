"use client";

import MarkdownRenderer from "./MarkdownRenderer";

interface ChefNoteProps {
  chefNoteTitle: string;
  chefsNote: string;
}

export default function ChefNote({ chefNoteTitle, chefsNote }: ChefNoteProps) {
  return (
    <section className="w-full max-w-4xl mx-auto px-6 ">
      <div className="relative">
        {/* ── Label above card ── */}
        <div className="flex items-center gap-3 mb-4">
          {/* Avatar / Icon */}
          <div className="shrink-0 mt-1">
            <div
              className="
                  h-12 w-12
                  flex items-center justify-center
                "
            >
              <span className="text-xl" role="img" aria-label="Chef">
                👨‍🍳
              </span>
            </div>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400">
            Chef's Note
          </span>
          <div className="h-px flex-1 bg-stone-100" />
        </div>

        {/* ── Main Card ── */}
        <div
          className="
            relative overflow-hidden
            bg-stone-50 shadow-xl
            rounded-2xl
            p-7 md:p-10
            transition-all duration-300
            hover:border-stone-300
            hover:shadow-2xl 
          "
        >
          {/* Large decorative quotation mark */}
          <span
            className="
              absolute top-4 right-7
              text-[96px] leading-none font-serif
              text-stone-200 select-none pointer-events-none
            "
            aria-hidden="true"
          >
            "
          </span>

          {/* ── Inner layout ── */}
          <div className="flex items-start gap-6 relative">
            {/* Text content */}
            <div className="flex-1 min-w-0">
              <h4
                className="
                  text-lg md:text-xl font-semibold
                  text-stone-900
                  leading-snug 
                  mb-3
                "
              >
                {chefNoteTitle}
              </h4>

              <div
                className="
                  text-[15px] leading-[1.85]
                  text-stone-600
                  prose prose-stone max-w-none
                  prose-p:m-0
                  prose-strong:text-stone-800
                  prose-strong:font-semibold
                "
              >
                <MarkdownRenderer content={chefsNote} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
