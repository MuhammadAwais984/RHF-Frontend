"use client";

import Image from "next/image";
import MarkdownRenderer from "./MarkdownRenderer";

interface ImageObj {
  url: string;
  alt: string;
}

interface Step {
  id: string;
  instruction: string;
  imageUrls: ImageObj[];
}

interface RecipeMethodProps {
  steps: Step[];
}

export default function RecipeMethod({ steps }: RecipeMethodProps) {
  return (
    <div className="lg:col-span-8 antialiased">
      {/* ── Section Header ── */}
      <div className="border-b border-stone-100 flex flex-row items-center justify-between gap-3 mb-10">
        <div>
          <h2 className="text-4xl font-semibold text-stone-900 tracking-tight">
            Method
          </h2>
        </div>
        <div className="h-px flex-1 bg-stone-200" />

        {/* Servings pill — optional, remove if not needed */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="shrink-0 text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500 bg-stone-50 border border-stone-200 px-4 py-2 rounded-full shadow-sm">
            {steps.length} Preparation Steps
          </span>
        </div>
      </div>

      {/* ── Steps List ── */}
      <div className="relative flex flex-col gap-6">
        {/* Vertical timeline thread — desktop only */}
        <div className="absolute left-[23.5px] top-10 bottom-10 w-px bg-stone-200 hidden md:block pointer-events-none" />

        {steps.map((step, index) => (
          <div
            key={step.id}
            className="relative flex flex-col md:flex-row gap-6 md:gap-10 group"
          >
            {/* ── Step Number Marker ── */}
            <div className="relative z-10 shrink-0">
              <div className="flex md:flex-col items-center gap-4 md:gap-0">
                <div className="w-12 h-12 rounded-full bg-white border-2 border-stone-900 flex items-center justify-center shadow-md transition-all duration-300 group-hover:bg-stone-900 group-hover:text-white">
                  <span className="text-lg font-serif font-bold italic leading-none">
                    {index + 1}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Content Card ── */}
            <div className="flex-1 bg-white rounded-3xl border border-stone-100 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-stone-200/50 hover:-translate-y-1">
              <div
                className={`grid grid-cols-1 ${
                  step.imageUrls.length > 0 ? "lg:grid-cols-2" : ""
                }`}
              >
                {/* Instruction Side */}
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <div className="prose prose-stone max-w-none text-stone-600 text-[16px] leading-relaxed prose-strong:text-stone-900 prose-strong:font-bold prose-p:mb-4 last:prose-p:mb-0">
                    <MarkdownRenderer content={step.instruction} />
                  </div>
                </div>

                {/* Image Side */}
                {step.imageUrls && step.imageUrls.length > 0 && (
                  <div
                    className={`
                      bg-stone-50/50 p-4 lg:p-6 border-t lg:border-t-0 lg:border-l border-stone-100
                      ${
                        step.imageUrls.length > 1
                          ? "grid grid-cols-2 gap-4"
                          : "flex flex-col"
                      }
                    `}
                  >
                    {step.imageUrls.map((imageObj) => (
                      <div
                        key={imageObj.url}
                        className="relative aspect-square md:aspect-[4/3] lg:aspect-square overflow-hidden rounded-2xl bg-stone-200 shadow-inner group/img"
                      >
                        <Image
                          src={imageObj.url}
                          alt={imageObj.alt}
                          fill
                          sizes="(max-width: 768px) 100vw, 400px"
                          className="object-cover transition-transform duration-700 group-hover/img:scale-110"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Aesthetic Progress Bar (reveals on hover) */}
              <div className="h-1.5 w-full bg-stone-50">
                <div className="h-full w-0 group-hover:w-full bg-stone-900 transition-all duration-1000 ease-in-out opacity-10" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
