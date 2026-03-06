"use client";

type Props = {
  content: string;
};

export default function MarkdownRenderer({ content }: Props) {
  return (
    <div
      className="
        prose prose-stone max-w-none
        /* Explicitly target headings inside the HTML */
        prose-headings:font-bold prose-headings:text-stone-900
        prose-h1:text-4xl md:prose-h1:text-5xl
        prose-h2:text-3xl md:prose-h2:text-4xl
        prose-h3:text-2xl
        prose-p:text-stone-600 prose-p:leading-relaxed
        /* This ensures any HTML from Strapi follows these rules */
      "
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
