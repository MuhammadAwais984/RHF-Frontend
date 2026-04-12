"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";

export default function RecipeQA({
  qa,
}: {
  qa: { id: number; question: string; answer: string }[];
}) {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggle = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  if (!qa || qa.length === 0) return null;

  return (
    <section className="max-w-4xl mx-auto mt-12 md:mt-20 px-4">
      {/* Header: Adjusted for mobile wrapping */}
      <div className="border-b border-stone-100 flex flex-row items-center justify-between gap-3 mb-10">
        <div>
          <h2 className="text-4xl font-semibold text-stone-900 tracking-tight">
            People Also Ask
          </h2>
        </div>
        <div className="h-px flex-1 bg-stone-200" />

        {/* Servings pill — optional, remove if not needed */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="shrink-0 text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500 bg-stone-50 border border-stone-200 px-4 py-2 rounded-full shadow-sm">
            {qa.length} Common Questions
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {qa.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className={`group transition-all duration-300 rounded-2xl border ${
                isOpen
                  ? "bg-stone-50 border-stone-200 shadow-sm"
                  : "bg-white border-stone-100 hover:border-stone-200"
              }`}
            >
              <button
                onClick={() => toggle(item.id)}
                className="w-full flex items-start justify-between p-5 md:p-6 text-left outline-none"
              >
                <div className="flex gap-3 md:gap-4">
                  {/* Icon stays fixed at the top left of the question */}
                  <div
                    className={`mt-1 shrink-0 transition-colors duration-300 ${
                      isOpen ? "text-red-700" : "text-stone-400"
                    }`}
                  >
                    <HelpCircle size={18} strokeWidth={2} />
                  </div>
                  <span
                    className={`font-medium text-base md:text-lg transition-colors leading-snug ${
                      isOpen ? "text-stone-900" : "text-stone-700"
                    }`}
                  >
                    {item.question}
                  </span>
                </div>

                <div
                  className={`mt-1 shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-red-700" : "text-stone-300"
                  }`}
                >
                  <ChevronDown size={20} />
                </div>
              </button>

              {/* Collapsible Answer: Reduced padding for mobile */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="pl-[42px] md:pl-[56px] pr-5 pb-6">
                    <div className="h-px w-6 bg-red-200 mb-4" />
                    <div className="text-stone-600 text-sm md:text-base leading-relaxed prose prose-stone max-w-none">
                      <MarkdownRenderer content={item.answer} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
