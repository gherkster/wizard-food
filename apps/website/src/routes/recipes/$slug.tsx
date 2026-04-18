import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import type { Ingredient } from "@wizard/content";
import { useMemo, useState } from "react";

import { BlurrableImage } from "@/components/domain/blurrable-image";
import { RecipeIngredient } from "@/components/domain/recipe-ingredient";
import { RecipeInstruction } from "@/components/domain/recipe-instruction";
import { ServingsAdjuster } from "@/components/domain/servings-adjuster";
import { Popover } from "@/components/ui/popover";
import { Tag } from "@/components/ui/tag";
import { formatDurationFromSeconds, totalRecipeDurationSeconds } from "@/lib/formatting";
import { recipeTotalDurationSeconds, secondsToIsoDuration } from "@/lib/seo";
import { getRecipe } from "@/server/content.functions";

const toIngredientKey = (groupName: string | undefined, ingredient: Ingredient) => {
  return `${groupName ?? "group"}-${ingredient.name.singular}-${ingredient.amount ?? "na"}`;
};

const RecipeDetailPage = () => {
  const recipe = Route.useLoaderData();

  const initialServings = recipe.servings > 0 ? recipe.servings : 1;
  const [servings, setServings] = useState(initialServings);

  const totalDuration = useMemo(() => {
    return formatDurationFromSeconds(totalRecipeDurationSeconds(recipe));
  }, [recipe]);

  const prepDuration = formatDurationFromSeconds(recipe.preparationDuration);
  const cookingDuration = formatDurationFromSeconds(recipe.cookingDuration);
  const customDuration = formatDurationFromSeconds(recipe.customDuration);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.descriptionSnippet,
    image: recipe.coverImage.variants.cover.square.src,
    recipeCategory: recipe.course,
    recipeCuisine: recipe.cuisine,
    recipeYield:
      recipe.servings <= 1
        ? `${recipe.servings} ${recipe.servingsType.singular}`
        : `${recipe.servings} ${recipe.servingsType.plural}`,
    keywords: recipe.tags
      .filter((tag) => tag !== recipe.course && tag !== recipe.cuisine)
      .join(", "),
    totalTime: secondsToIsoDuration(recipeTotalDurationSeconds(recipe)),
  };

  return (
    <article className="space-y-16 pb-14">
      <section className="grid gap-10 lg:grid-cols-12 lg:items-center">
        <header className="space-y-6 lg:col-span-5">
          <div className="flex flex-wrap gap-2">
            {recipe.tags.slice(0, 4).map((tag) => (
              <Link key={tag} to="/recipes" search={() => ({ search: tag })}>
                <Tag>{tag}</Tag>
              </Link>
            ))}
          </div>

          <h1 className="text-5xl font-bold leading-tight sm:text-6xl">{recipe.title}</h1>
          <div
            className="max-w-xl text-lg text-[color:var(--color-muted)]"
            dangerouslySetInnerHTML={{ __html: recipe.description }}
          />

          <div className="grid gap-4 border-y border-[color:var(--color-border)]/45 py-5 sm:grid-cols-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--color-muted)]">
                Total
              </p>
              <p className="text-xl font-semibold text-[color:var(--color-primary)]">
                {totalDuration ?? "-"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--color-muted)]">
                Prep
              </p>
              <p className="text-xl font-semibold text-[color:var(--color-primary)]">
                {prepDuration ?? "-"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--color-muted)]">
                Servings
              </p>
              <p className="text-xl font-semibold text-[color:var(--color-primary)]">
                {recipe.servings ?? initialServings}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            {totalDuration ? (
              <Popover
                trigger={<span className="text-sm font-medium">Time breakdown</span>}
                align="start"
              >
                <ul className="space-y-1 text-sm">
                  {prepDuration ? (
                    <li>
                      Preparation <b>{prepDuration}</b>
                    </li>
                  ) : null}
                  {cookingDuration ? (
                    <li>
                      Cooking <b>{cookingDuration}</b>
                    </li>
                  ) : null}
                  {recipe.customDurationName && customDuration ? (
                    <li>
                      {recipe.customDurationName} <b>{customDuration}</b>
                    </li>
                  ) : null}
                </ul>
              </Popover>
            ) : null}

            <ServingsAdjuster
              servings={servings}
              singularLabel={recipe.servingsType?.singular}
              pluralLabel={recipe.servingsType?.plural}
              onChange={setServings}
            />
          </div>
        </header>

        <div className="relative lg:col-span-7 lg:pl-8">
          <div className="pointer-events-none absolute -right-8 -top-8 h-44 w-44 rounded-full bg-[color:var(--color-primary)]/15 blur-3xl" />
          <div className="overflow-hidden rounded-2xl shadow-[0_24px_80px_-45px_rgba(0,0,0,0.8)]">
            <BlurrableImage image={recipe.coverImage} variant="cover" aspectRatio="portrait" />
          </div>
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <div className="rounded-2xl border border-[color:var(--color-border)]/40 bg-[color:var(--color-surface-soft)] p-7 lg:sticky lg:top-28">
            <h2 className="mb-5 text-3xl font-semibold">Ingredients</h2>
            <div className="space-y-6">
              {recipe.ingredientGroups.map((group) => (
                <div key={`${group.name ?? "group"}-${group.ingredients.length}`}>
                  {group.name ? (
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-[color:var(--color-muted)]">
                      {group.name}
                    </p>
                  ) : null}
                  <ul className="space-y-2">
                    {group.ingredients
                      .filter((ingredient) => !ingredient.inlineOnly)
                      .map((ingredient) => (
                        <li
                          key={toIngredientKey(group.name, ingredient)}
                          className="text-sm leading-relaxed"
                        >
                          <RecipeIngredient
                            ingredient={ingredient}
                            servings={servings}
                            baseServings={initialServings}
                          />
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="space-y-10 lg:col-span-8">
          <h2 className="text-4xl font-semibold">The Method</h2>
          {recipe.instructionGroups.map((group) => (
            <div
              key={`${group.name ?? "group"}-${group.instructions.length}`}
              className="space-y-7"
            >
              {group.name ? (
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[color:var(--color-muted)]">
                  {group.name}
                </p>
              ) : null}
              <ol className="space-y-8">
                {group.instructions.map((instruction, index) => (
                  <li key={instruction.text} className="grid gap-4 sm:grid-cols-[56px_1fr]">
                    <span className="text-5xl font-semibold leading-none text-[color:var(--color-border)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <RecipeInstruction
                      content={instruction.text}
                      servings={servings}
                      baseServings={initialServings}
                    />
                  </li>
                ))}
              </ol>
            </div>
          ))}

          {recipe.note ? (
            <section className="rounded-2xl border border-[color:var(--color-border)]/35 bg-[color:var(--color-surface)]/85 p-6">
              <h3 className="mb-2 text-2xl font-semibold">Notes</h3>
              <div
                className="text-[color:var(--color-muted)]"
                dangerouslySetInnerHTML={{ __html: recipe.note }}
              />
            </section>
          ) : null}
        </section>
      </section>

      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </article>
  );
};

export const Route = createFileRoute("/recipes/$slug")({
  loader: async ({ params }) => {
    const recipe = await getRecipe({ data: { slug: params.slug } });
    if (!recipe) {
      throw notFound();
    }

    return recipe;
  },
  component: RecipeDetailPage,
  head: ({ loaderData: recipe }) => ({
    meta: [
      { title: recipe?.title },
      {
        name: "description",
        content: recipe?.descriptionPlainText,
      },
      {
        property: "og:title",
        content: recipe?.title,
      },
      {
        property: "og:description",
        content: recipe?.descriptionSnippet,
      },
      {
        property: "og:image",
        content: recipe?.coverImage.variants.cover.square.src,
      },
    ],
  }),
});
