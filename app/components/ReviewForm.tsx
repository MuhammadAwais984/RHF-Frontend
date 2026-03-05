"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Lock } from "lucide-react";

export default function ReviewForm({ recipeId }: { recipeId: number }) {
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_STRAPI_URL + "/api";

  const [form, setForm] = useState({ name: "", email: "", comment: "" });
  const [loading, setLoading] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check LocalStorage on mount
  useEffect(() => {
    setMounted(true);
    const localReview = localStorage.getItem(`recipe_review_${recipeId}`);
    if (localReview) {
      setHasReviewed(true);
    }
  }, [recipeId]);

  if (!mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            name: form.name,
            email: form.email,
            comment: form.comment,
            recipe: recipeId, // relation id
            statu: "PENDING", // correct spelling
          },
        }),
      });

      if (!res.ok) throw new Error("Failed to submit");

      // Professional Way: Save to LocalStorage
      localStorage.setItem(`recipe_review_${recipeId}`, "true");
      setHasReviewed(true);
      router.refresh();
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS STATE: Beautiful Placeholder instead of a blank page
  if (hasReviewed) {
    return (
      <div className="max-w-xl mx-auto bg-stone-50 border border-stone-200 rounded-3xl p-10 text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-2xl font-serif font-bold text-stone-900">
          Review Received!
        </h3>
        <p className="text-stone-500 leading-relaxed">
          Thank you for sharing your thoughts. To maintain the quality of our
          community, reviews are manually approved by our chefs before
          appearing.
        </p>
        <div className="pt-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-300 flex items-center justify-center gap-2">
            <Lock size={12} /> Limit: One review per recipe
          </span>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto bg-white border border-orange-100 rounded-3xl p-8 shadow-xl shadow-orange-900/5 space-y-6"
    >
      <div className="space-y-1">
        <h3 className="text-2xl font-serif font-bold text-stone-900">
          Enjoyed the meal?
        </h3>
        <p className="text-stone-500 text-sm">
          Your feedback helps our chefs improve their recipes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-stone-400 uppercase ml-1 tracking-tighter">
            Full Name
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-stone-50 border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-all"
            placeholder="Name"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-stone-400 uppercase ml-1 tracking-tighter">
            Email Address
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-stone-50 border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-orange-500 transition-all"
            placeholder="user@example.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold text-stone-400 uppercase ml-1 tracking-tighter">
          Experience
        </label>
        <textarea
          required
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
          className="w-full bg-stone-50 border-stone-200 rounded-xl px-4 py-3 min-h-[120px] outline-none focus:border-orange-500 transition-all resize-none"
          placeholder="What did you think of the flavors?"
        />
      </div>

      <button
        disabled={loading}
        className={`w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all ${
          loading
            ? "bg-stone-100 text-stone-400 cursor-not-allowed"
            : "bg-red-700 text-white hover:bg-red-800 active:scale-[0.98]"
        }`}
      >
        {loading ? "Sending..." : "Submit My Review"}
      </button>
    </form>
  );
}
