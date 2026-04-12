import Image from "next/image";
import FormatDate from "../../../components/FormatDate";
import { ActivityIcon, ClockIcon, FlameIcon, UsersIcon } from "lucide-react";
import ReviewForm from "@/app/components/ReviewForm";
import RecipeReviews from "@/app/components/RecipeReviews";
import NutritionSection from "@/app/components/Nutrition";
import RecipeImageCarousel from "@/app/components/RecipeImageCarousel";
import MarkdownRenderer from "@/app/components/MarkdownRenderer";
import RecipeQA from "@/app/components/RecipeQA";
import IncrementView from "@/app/components/IncrementView";
import FavoriteButton from "@/app/components/FavoriteButton";
import ShareButton from "@/app/components/ShareButton";
import { RecipeStats } from "@/app/components/RecipeStats";
import RecipeMethod from "@/app/components/RecipeSteps";
import ChefNote from "@/app/components/RecipeChefsNote";
import Ingredients from "@/app/components/RecipeIngredients";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; recipeSlug: string }>;
}) {
  const { recipeSlug } = await params;

  const recipe = await getRecipe(recipeSlug);

  return {
    title: `${recipe.title} | Regional Heritage Food`,
    description: recipe.metaDescription?.replace(/<[^>]+>/g, "").slice(0, 155),

    alternates: {
      canonical: `https://yourdomain.com/recipes/${recipe.categorySlug}/${recipe.slug}`,
    },

    openGraph: {
      title: recipe.title,
      description: recipe.metaDescription,
      url: `https://yourdomain.com/recipes/${recipe.categorySlug}/${recipe.slug}`,
      images: [recipe.images?.[0]?.url],
      type: "article",
    },

    twitter: {
      card: "summary_large_image",
      title: recipe.title,
      description: recipe.metaDescription,
      images: [recipe.images?.[0]?.url],
    },
    keywords: [
      recipe.title,
      `${recipe.title} recipe`,
      "traditional recipe",
      "homemade food",
    ],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
  };
}
function formatTime(minutes: number): string {
  if (!minutes || minutes === 0) return "0m";

  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

async function getRecipe(slug: string) {
  if (!slug) throw new Error("Missing recipe slug");

  const res = await fetch(
    `${process.env.API_URL}/recipes?filters[slug][$eq]=${slug}
&populate[coverImages]=true
&populate[authorImage]=true
&populate[chefImage]=true
&populate[recipe_category]=true
&populate[nutrition]=true
&populate[ingredients][populate]=*
&populate[steps][populate]=*
&populate[questionAnswer][populate]=*`,
    { cache: "no-store" },
  );
  if (!res.ok) throw new Error("Failed to load recipe");

  const json = await res.json();
  const recipe = json.data?.[0];

  if (!recipe) {
    const { notFound } = await import("next/navigation");
    notFound();
  }

  const BASE = process.env.NEXT_PUBLIC_STRAPI_URL || process.env.API_URL;

  return {
    ...recipe,

    // ✅ Cover Images (you can choose format if you want)
    images:
      recipe.coverImages?.map((img: any) => ({
        url: `${BASE}${img.url}`,
        altText: img.alternativeText || "",
      })) || [],
    chefImage: recipe.chefImage?.url ? `${BASE}${recipe.chefImage.url}` : null,

    authorImage: recipe.authorImage?.url
      ? `${BASE}${recipe.authorImage.url}`
      : null,

    // ✅ Ingredients with images
    // ... inside getRecipe map for ingredients
    ingredients:
      recipe.ingredients?.map((ing: any) => ({
        id: ing.id,
        ingredientName: ing.Name,
        quantity: ing.Quantity,
        unit: ing.Unit,
        preparationNote: ing.Note,
        // Strapi usually returns an array for media fields, check if yours is an array or object
        imageUrl: ing.IngredientImages?.[0]?.url
          ? `${BASE}${ing.IngredientImages[0].url}`
          : ing.IngredientImages?.url
            ? `${BASE}${ing.IngredientImages.url}`
            : null,
        altText: ing.IngredientImages?.alternativeText || ing.Name,
      })) || [],

    // ... inside getRecipe map for steps
    // Inside your getRecipe function, update the steps mapping:
    steps:
      recipe.steps?.map((step: any) => ({
        id: step.id,
        instruction: step.instruction,
        // Ensure we map the array of images and prepend the BASE URL
        imageUrls:
          step.StepsImages?.map((img: any) => ({
            url: `${BASE}${img.url}`,
            alt: img.alternativeText || `Step instruction image`,
          })) || [],
      })) || [],
    questionAnswer:
      recipe.questionAnswer?.map((qa: any) => ({
        id: qa.id,
        question: qa.question,
        answer: qa.answer || "",
      })) || [],
    categorySlug: recipe.recipe_category?.slug,
    categoryName: recipe.recipe_category?.Name,
    reviews:
      recipe.reviews?.map((r: any) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        comment: r.comment,
        createdAt: r.createdAt,
      })) || [],
  };
}

export default async function RecipeDetailsPage({
  params,
}: {
  params: Promise<{ category: string; recipeSlug: string }>;
}) {
  const { recipeSlug } = await params;

  const recipe = await getRecipe(recipeSlug);
  const nutrition = recipe?.nutrition;
  const headImages = recipe.images || [];
  const hasNutrition =
    nutrition &&
    Object.values(nutrition).some((val) => {
      if (typeof val === "number") return val > 0;
      if (typeof val === "string") return parseFloat(val) > 0;
      return false;
    });
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Recipes",
        item: "https://yourdomain.com/recipes",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: recipe.categoryName,
        item: `https://yourdomain.com/recipes/${recipe.categorySlug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: recipe.title,
      },
    ],
  };
  const jsonLd = {
    "@context": "https://schema.org",
    "@id": `https://yourdomain.com/recipes/${recipe.categorySlug}/${recipe.slug}#recipe`,
    "@type": "Recipe",
    name: recipe.title,
    image:
      recipe.images?.length > 0
        ? recipe.images.map((i: any) => i.url)
        : ["https://yourdomain.com/default-recipe.jpg"],

    description: recipe.metaDescription?.replace(/<[^>]+>/g, ""),

    author: {
      "@type": "Person",
      name: recipe.authorName || "Regional Heritage Food",
    },

    datePublished: new Date(recipe.createdAt).toISOString(),
    dateModified: new Date(recipe.updatedAt).toISOString(),

    recipeYield: `${recipe.servings} servings`,
    prepTime: `PT${recipe.prepTime}M`,
    cookTime: `PT${recipe.cookTime}M`,
    totalTime: `PT${recipe.prepTime + recipe.cookTime}M`,

    recipeCategory: recipe.mealTypes?.join(", "),
    recipeCuisine: recipe.cuisines?.join(", "),

    recipeIngredient: recipe.ingredients.map((i: any) =>
      `${i.quantity || ""} ${i.unit || ""} ${i.ingredientName}`.trim(),
    ),

    recipeInstructions: recipe.steps.map((s: any) => ({
      "@type": "HowToStep",
      text: s.instruction.replace(/<[^>]+>/g, ""),
    })),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://yourdomain.com/recipes/${recipe.slug}`,
    },
    ...(recipe.avgRating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Number(recipe.avgRating),
            reviewCount: Number(recipe.reviewCount || 1),
          },
        }
      : {}),
  };

  return (
    <div className="bg-[#f8f7f4] text-[#1c1c1c]">
      <IncrementView recipeId={recipe.id} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {/* HERO */}
      <section className="bg-[#fafaf9] pt-10 pb-10 antialiased px-4">
        <div className="max-w-4xl mx-auto flex flex-col px-6 md:px-0">
          <div className="flex flex-row justify-between items-center">
            <h1 className="md:text-5xl text-4xl mb-2 text-stone-900 font-extrabold">
              {recipe.title}
            </h1>
            <ShareButton
              url={`/recipes/${recipe.categorySlug}/${recipe.slug}`}
              title={recipe.title}
              description={recipe.subtitle || recipe.metaDescription}
              image={
                recipe.images?.[0]?.url
                  ? recipe.images[0].url.startsWith("http")
                    ? recipe.images[0].url
                    : `${process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com"}${recipe.images[0].url}`
                  : undefined
              }
              variant="icon"
            />
          </div>

          <div className="flex items-center justify-between">
            {/* Heart Icon with a subtle glow */}
            <span className="text-lg font-serif italic text-stone-700">
              {recipe.favouritesCount.toLocaleString()}{" "}
              <span className="text-stone-400 font-sans not-italic text-sm ml-1">
                People Liked
              </span>
            </span>
          </div>

          <div className="flex flex-col gap-6 mb-12">
            <div className="flex flex-wrap items-center gap-4 md:gap-6"></div>

            <div className="flex flex-col md:flex-row md:items-center gap-y-4 gap-x-8 text-[10px] md:text-xs uppercase tracking-[0.2em] text-stone-500 font-medium">
              {/* WRAPPER FOR CHEF AND AUTHOR TO SIT SIDE-BY-SIDE ON TABLETS IF NEEDED */}
              <div className="flex flex-wrap items-center gap-6">
                {/* CHEF SECTION */}
                <div className="relative group flex items-center gap-3 cursor-pointer md:cursor-help">
                  {/* Persistent Avatar */}
                  <div className="relative w-8 h-8 md:w-10 md:h-10 shrink-0">
                    {recipe.chefImage ? (
                      <Image
                        src={recipe.chefImage || "/placeholder-chef.jpg"}
                        alt={recipe.chef}
                        fill
                        className="rounded-full object-cover border border-stone-200 shadow-sm"
                      />
                    ) : (
                      <div className="w-full h-full bg-stone-100 flex items-center rounded-full justify-center text-[10px] text-stone-400 border border-stone-200">
                        C
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-stone-400 text-[9px] md:text-[10px]">
                      By Chef
                    </span>
                    <span className="text-stone-900 font-bold border-b border-transparent md:group-hover:border-red-600 transition-all leading-tight">
                      {recipe.chef}
                    </span>
                  </div>

                  {/* Hover Card - Hidden on Mobile (md:block) */}
                  <div className="hidden md:block absolute top-full left-0 mt-3 w-72 p-6 bg-white border border-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl opacity-0 -translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-[100]">
                    <div className="absolute -top-1.5 left-6 w-3 h-3 bg-white border-l border-t border-stone-100 rotate-45" />
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-1 bg-red-600 h-8 rounded-full" />
                        <div>
                          <p className="text-stone-900 font-bold tracking-tight text-sm leading-none mb-1">
                            {recipe.chef}
                          </p>
                          <p className="text-[9px] text-red-600 font-bold tracking-[0.15em] uppercase">
                            Chef{" "}
                          </p>
                        </div>
                      </div>
                      <p className="normal-case tracking-normal text-stone-600 leading-relaxed italic font-serif text-[14px]">
                        &ldquo;
                        {recipe.chefDescription ||
                          "Expert in traditional techniques with a focus on seasonal, local ingredients."}
                        &rdquo;
                      </p>
                    </div>
                  </div>
                </div>

                {/* AUTHOR SECTION */}
                <div className="relative group flex items-center gap-3 cursor-pointer md:cursor-help">
                  <div className="relative w-8 h-8 md:w-10 md:h-10 shrink-0">
                    {recipe.authorImage ? (
                      <Image
                        src={recipe.authorImage || "/placeholder-author.jpg"}
                        alt={recipe.authorName}
                        fill
                        className="rounded-full object-cover border border-stone-200 shadow-sm"
                      />
                    ) : (
                      <div className="w-full h-full bg-stone-100 flex items-center rounded-full justify-center text-[10px] text-stone-400 border border-stone-200">
                        A
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-stone-400 text-[9px] md:text-[10px]">
                      Author
                    </span>
                    <span className="text-stone-900 font-bold border-b border-transparent md:group-hover:border-red-600 transition-all leading-tight">
                      {recipe.authorName || "Julianne Smith"}
                    </span>
                  </div>

                  {/* Hover Card - Hidden on Mobile (md:block) */}
                  <div className="hidden md:block absolute top-full left-0 mt-3 w-72 p-6 bg-white border border-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl opacity-0 -translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-[100]">
                    <div className="absolute -top-1.5 left-6 w-3 h-3 bg-white border-l border-t border-stone-100 rotate-45" />
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-1 bg-stone-900 h-8 rounded-full" />
                        <div>
                          <p className="text-stone-900 font-bold tracking-tight text-sm leading-none mb-1">
                            {recipe.authorName}
                          </p>
                          <p className="text-[9px] text-stone-400 font-bold tracking-[0.15em] uppercase">
                            Food Journalist
                          </p>
                        </div>
                      </div>
                      <p className="normal-case tracking-normal text-stone-600 leading-relaxed text-[14px]">
                        {recipe.authorDescription ||
                          "Sharing kitchen-tested stories and the history behind every dish."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SEPARATOR (Hidden on Mobile) */}
              <span className="hidden md:block w-px h-4 bg-stone-200" />

              {/* UPDATED DATE */}
              <div className="flex items-center gap-2 pt-2 md:pt-0 border-t border-stone-100 md:border-none">
                <span className="normal-case text-stone-400 font-light">
                  Updated on
                  <span className="text-stone-700 ml-1 font-medium">
                    {FormatDate(recipe.updatedAt)}
                  </span>
                </span>
              </div>
            </div>

            {/* <div className="flex items-center justify-center  gap-4">
              <RecipeActions recipeId={recipe.id} />
            </div> */}
          </div>

          <div className="space-y-12">
            <div className="border-b-2 border-red-500/10 w-full"></div>
            <h2 className="text-3xl text-stone-600 mb-5 italic font-bold">
              {recipe.subtitle}
            </h2>

            {/* MAIN STORY / DESCRIPTION */}
            <div className="relative">
              <div
                className=" text-stone-600 leading-relaxed  md:text-lg
          text-justify hyphens-auto
          first-letter:text-7xl first-letter:font-bold 
          first-letter:text-stone-900 first-letter:mr-3 first-letter:float-left
          first-letter:leading-[0.8] first-letter:mt-[0.1em]"
              >
                <MarkdownRenderer content={recipe.description} />
              </div>
            </div>
          </div>
        </div>
        {/* Footer Divider */}
        {/* 5. PIC (FULL WIDTH BELOW) */}
        <div className="py-12 bg-stone-50">
          <div className="max-w-4xl mx-auto px-4">
            <RecipeImageCarousel images={headImages} title={recipe.title} />
          </div>
        </div>
        {/* ----------------------------------------------------------------------- */}
        <RecipeStats recipe={recipe} />
      </section>

      {/* INGREDIENTS */}
      <section>
        <Ingredients ingredients={recipe.ingredients} />
      </section>

      {/* STEPS */}
      <section className="w-full max-w-4xl mx-auto px-6 py-12">
        <RecipeMethod steps={recipe.steps} />
      </section>

      <section>
        <ChefNote
          chefNoteTitle={recipe.chefNoteTitle}
          chefsNote={recipe.chefsNote}
        />
      </section>
      <section className="w-full max-w-4xl mx-auto px-6 py-12">
        <NutritionSection recipe={recipe} hasNutrition={hasNutrition} />
      </section>
      {/* <section className="max-w-4xl mx-auto mt-10 px-6">
        <div className="flex items-center gap-4 mb-10">
          <h2 className="text-4xl text-stone-800">Reviews</h2>
          <div className="h-px flex-1 bg-stone-200 mt-2"></div>
        </div>
        <ReviewForm recipeId={recipe.id} />

        <div className="max-w-2xl mx-auto space-y-6 mt-5">
          <RecipeReviews recipeId={recipe.id} />
        </div>
      </section> */}
      <section className="w-full max-w-4xl mx-auto">
        <div className="space-y-6">
          <RecipeQA qa={recipe.questionAnswer} />
        </div>
      </section>
    </div>
  );
}

function StatItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-4 transition-transform duration-300 hover:-translate-y-1">
      <div className="mb-3 p-2 bg-orange-50 rounded-xl">{icon}</div>
      <span className="text-[11px] uppercase tracking-[0.15em] font-bold text-stone-400 mb-1">
        {label}
      </span>
      <span className="text-xl font-serif font-bold text-stone-800">
        {value}
      </span>
    </div>
  );
}
