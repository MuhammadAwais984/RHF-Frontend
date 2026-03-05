"use client";

type Props = {
  content: string;
};

export default function MarkdownRenderer({ content }: Props) {
  return (
    <div
      className="prose prose-stone max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
