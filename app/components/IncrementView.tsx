"use client";

import { useEffect, useRef } from "react";

export default function IncrementView({ recipeId }: { recipeId: number }) {
  const hasIncremented = useRef(false);

  useEffect(() => {
    if (hasIncremented.current) return;

    hasIncremented.current = true;

    fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/recipes/${recipeId}/increment-view`,
      {
        method: "POST",
      },
    );
  }, [recipeId]);

  return null;
}
