"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return setResults([]);

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300); // debounce 300ms

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="w-full max-w-3xl mt-10 bg-amber-600">
      <input
        type="text"
        placeholder="Search all recipes, categories, ingredients..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
      />

      {loading && <p className="mt-2 text-sm text-gray-500">Searching...</p>}

      {results.length > 0 && (
        <div className="mt-4 bg-white border rounded-md shadow divide-y divide-gray-100">
          {results.map((item: any) => (
            <a
              key={item.id}
              href={item.url}
              className="flex items-center gap-4 p-3 hover:bg-gray-50"
            >
              {item.image && (
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">
                  {item.title}
                </p>
                <p className="text-xs text-gray-500">{item.type}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
