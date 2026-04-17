import { useEffect, useMemo, useState } from "react";
import type { Image } from "@wizard/content";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";

import type { RecipeSearch } from "@/models/content";
import {
  allSearchRecipes,
  searchRecipes,
  type RecipeSearchResult,
} from "@/lib/search/search-client";
import { searchIndexToCardImage } from "@/lib/images";
import { getRecipesPageData } from "@/lib/content";
import { Select } from "@/components/ui/select";
import { BlurrableImage } from "@/components/domain/blurrable-image";

type RecipeListItem = {
  slug: string;
  title: string;
  image: Image;
  tags: string[];
  cuisine?: string;
  mainIngredients: string[];
  cookingStyle?: string;
  diets: string[];
  tag?: string;
  duration?: string;
};

type PrepTimeFilter = NonNullable<RecipeSearch["prepTime"]>;
type DietValue = "vegetarian" | "vegan";
type FacetOption = {
  value: string;
  label: string;
  count: number;
};
type FacetState = {
  options: FacetOption[];
  baselineCount: number;
  availableCount: number;
};

type FilterState = {
  cuisine?: string;
  ingredient?: string;
  cookingStyle?: string;
  diet?: DietValue;
  prepTime?: PrepTimeFilter;
};

const prepTimeOptions: Array<{ value: PrepTimeFilter; label: string }> = [
  { value: "under-30", label: "Under 30m" },
  { value: "30-60", label: "30-60m" },
  { value: "60-plus", label: "60m+" },
];

const dietOptions: Array<{ value: DietValue; label: string }> = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
];

const normalize = (value: string) => {
  return value.trim().toLowerCase();
};

const toSingleString = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.find((item): item is string => typeof item === "string");
  }
  return typeof value === "string" ? value : undefined;
};

const toDurationMinutes = (value?: string) => {
  if (!value) {
    return null;
  }

  const hours = value.match(/(\d+)h/);
  const minutes = value.match(/(\d+)m/);
  const total = (hours ? Number(hours[1]) * 60 : 0) + (minutes ? Number(minutes[1]) : 0);

  if (!Number.isFinite(total) || total <= 0) {
    return null;
  }

  return total;
};

const matchesPrepTime = (durationLabel: string | undefined, prepTime?: PrepTimeFilter) => {
  if (!prepTime) {
    return true;
  }

  const minutes = toDurationMinutes(durationLabel);
  if (minutes === null) {
    return false;
  }

  if (prepTime === "under-30") {
    return minutes < 30;
  }
  if (prepTime === "30-60") {
    return minutes >= 30 && minutes <= 60;
  }
  return minutes > 60;
};

const includesNormalized = (values: string[], expected?: string) => {
  if (!expected) {
    return true;
  }

  return values.some((value) => normalize(value) === normalize(expected));
};

const equalsNormalized = (value: string | undefined, expected?: string) => {
  if (!expected) {
    return true;
  }
  if (!value) {
    return false;
  }

  return normalize(value) === normalize(expected);
};

const mapSearchRecipe = (recipe: RecipeSearchResult): RecipeListItem => {
  return {
    slug: recipe.slug,
    title: recipe.title,
    image: searchIndexToCardImage(recipe),
    tags: recipe.tags,
    cuisine: recipe.cuisine,
    mainIngredients: recipe.mainIngredients ?? [],
    cookingStyle: recipe.cookingStyle,
    diets: recipe.diets?.map((diet) => normalize(diet)) ?? [],
    tag: recipe.featuredTag,
    duration: recipe.totalDurationLabel,
  };
};

const withSelectedOption = (
  options: FacetOption[],
  selected: string | undefined,
  label = selected,
) => {
  if (!selected) {
    return options;
  }

  const selectedKey = normalize(selected);
  if (options.some((option) => normalize(option.value) === selectedKey)) {
    return options;
  }

  return [...options, { value: selected, label: label ?? selected, count: 0 }];
};

const RecipesPage = () => {
  const data = Route.useLoaderData();
  const { search, cuisine, ingredient, cookingStyle, diet, prepTime } = Route.useSearch();
  const [indexRecipes, setIndexRecipes] = useState<RecipeSearchResult[] | null>(null);
  const navigate = useNavigate({ from: "/recipes/" });

  useEffect(() => {
    let isCancelled = false;

    const runSearch = async () => {
      const results = search?.trim() ? await searchRecipes(search) : await allSearchRecipes();
      if (!isCancelled) {
        setIndexRecipes(results);
      }
    };

    void runSearch();

    return () => {
      isCancelled = true;
    };
  }, [search]);

  const recipesBeforeFilter = useMemo(() => {
    return indexRecipes ? indexRecipes.map(mapSearchRecipe) : [];
  }, [indexRecipes]);
  const isIndexLoading = indexRecipes === null;

  const applyFilters = (
    items: RecipeListItem[],
    filters: FilterState,
    exclude?: keyof FilterState,
  ) => {
    return items.filter((recipe) => {
      const cuisineMatch =
        exclude === "cuisine" ? true : equalsNormalized(recipe.cuisine, filters.cuisine);
      const ingredientMatch =
        exclude === "ingredient"
          ? true
          : includesNormalized(recipe.mainIngredients, filters.ingredient);
      const cookingStyleMatch =
        exclude === "cookingStyle"
          ? true
          : equalsNormalized(recipe.cookingStyle, filters.cookingStyle);
      const dietMatch = exclude === "diet" ? true : includesNormalized(recipe.diets, filters.diet);
      const prepTimeMatch =
        exclude === "prepTime" ? true : matchesPrepTime(recipe.duration, filters.prepTime);

      return cuisineMatch && ingredientMatch && cookingStyleMatch && dietMatch && prepTimeMatch;
    });
  };

  const activeFilters: FilterState = {
    cuisine,
    ingredient,
    cookingStyle,
    diet,
    prepTime,
  };

  const recipes = useMemo(() => {
    return applyFilters(recipesBeforeFilter, activeFilters);
  }, [recipesBeforeFilter, cuisine, ingredient, cookingStyle, diet, prepTime]);

  const cuisineFacet = useMemo<FacetState>(() => {
    const baselineCounts = new Map<string, number>();
    recipesBeforeFilter.forEach((recipe) => {
      if (!recipe.cuisine) {
        return;
      }
      baselineCounts.set(recipe.cuisine, (baselineCounts.get(recipe.cuisine) ?? 0) + 1);
    });
    const baselineOptions = [...baselineCounts.entries()]
      .map(([value]) => ({ value, label: value }))
      .sort((a, b) => a.label.localeCompare(b.label));

    const availableCounts = new Map<string, number>();
    const source = applyFilters(recipesBeforeFilter, activeFilters, "cuisine");
    source.forEach((recipe) => {
      if (!recipe.cuisine) {
        return;
      }
      availableCounts.set(recipe.cuisine, (availableCounts.get(recipe.cuisine) ?? 0) + 1);
    });

    const options = withSelectedOption(
      baselineOptions.map((option) => ({
        value: option.value,
        label: option.label,
        count: availableCounts.get(option.value) ?? 0,
      })),
      cuisine,
    );

    const availableCount = options.filter((option) => option.count > 0).length;
    return { options, baselineCount: baselineOptions.length, availableCount };
  }, [recipesBeforeFilter, cuisine, ingredient, cookingStyle, diet, prepTime]);

  const ingredientFacet = useMemo<FacetState>(() => {
    const baselineCounts = new Map<string, number>();
    recipesBeforeFilter.forEach((recipe) => {
      recipe.mainIngredients.forEach((value) => {
        baselineCounts.set(value, (baselineCounts.get(value) ?? 0) + 1);
      });
    });
    const baselineOptions = [...baselineCounts.entries()]
      .map(([value]) => ({ value, label: value }))
      .sort((a, b) => a.label.localeCompare(b.label));

    const availableCounts = new Map<string, number>();
    const source = applyFilters(recipesBeforeFilter, activeFilters, "ingredient");
    source.forEach((recipe) => {
      recipe.mainIngredients.forEach((value) => {
        availableCounts.set(value, (availableCounts.get(value) ?? 0) + 1);
      });
    });

    const options = withSelectedOption(
      baselineOptions.map((option) => ({
        value: option.value,
        label: option.label,
        count: availableCounts.get(option.value) ?? 0,
      })),
      ingredient,
    );
    const availableCount = options.filter((option) => option.count > 0).length;
    return { options, baselineCount: baselineOptions.length, availableCount };
  }, [recipesBeforeFilter, cuisine, ingredient, cookingStyle, diet, prepTime]);

  const cookingStyleFacet = useMemo<FacetState>(() => {
    const baselineCounts = new Map<string, number>();
    recipesBeforeFilter.forEach((recipe) => {
      if (!recipe.cookingStyle) {
        return;
      }
      baselineCounts.set(recipe.cookingStyle, (baselineCounts.get(recipe.cookingStyle) ?? 0) + 1);
    });
    const baselineOptions = [...baselineCounts.entries()]
      .map(([value]) => ({ value, label: value }))
      .sort((a, b) => a.label.localeCompare(b.label));

    const availableCounts = new Map<string, number>();
    const source = applyFilters(recipesBeforeFilter, activeFilters, "cookingStyle");
    source.forEach((recipe) => {
      if (!recipe.cookingStyle) {
        return;
      }
      availableCounts.set(recipe.cookingStyle, (availableCounts.get(recipe.cookingStyle) ?? 0) + 1);
    });

    const options = withSelectedOption(
      baselineOptions.map((option) => ({
        value: option.value,
        label: option.label,
        count: availableCounts.get(option.value) ?? 0,
      })),
      cookingStyle,
    );
    const availableCount = options.filter((option) => option.count > 0).length;
    return { options, baselineCount: baselineOptions.length, availableCount };
  }, [recipesBeforeFilter, cuisine, ingredient, cookingStyle, diet, prepTime]);

  const dietFacet = useMemo<FacetState>(() => {
    const allowed = new Set(dietOptions.map((option) => option.value));
    const baselineCounts = new Map<DietValue, number>();
    recipesBeforeFilter.forEach((recipe) => {
      recipe.diets.forEach((value) => {
        const normalizedDiet = normalize(value);
        if (allowed.has(normalizedDiet as DietValue)) {
          const casted = normalizedDiet as DietValue;
          baselineCounts.set(casted, (baselineCounts.get(casted) ?? 0) + 1);
        }
      });
    });
    const baselineOptions = dietOptions.filter(
      (option) => (baselineCounts.get(option.value) ?? 0) > 0,
    );

    const availableCounts = new Map<DietValue, number>();
    const source = applyFilters(recipesBeforeFilter, activeFilters, "diet");
    source.forEach((recipe) => {
      recipe.diets.forEach((value) => {
        const normalizedDiet = normalize(value);
        if (allowed.has(normalizedDiet as DietValue)) {
          const casted = normalizedDiet as DietValue;
          availableCounts.set(casted, (availableCounts.get(casted) ?? 0) + 1);
        }
      });
    });

    const options = withSelectedOption(
      baselineOptions.map((option) => ({
        value: option.value,
        label: option.label,
        count: availableCounts.get(option.value) ?? 0,
      })),
      diet,
    );
    const availableCount = options.filter((option) => option.count > 0).length;
    return { options, baselineCount: baselineOptions.length, availableCount };
  }, [recipesBeforeFilter, cuisine, ingredient, cookingStyle, diet, prepTime]);

  const durationFacet = useMemo<FacetState>(() => {
    const baselineOptions = prepTimeOptions.filter((option) => {
      const count = recipesBeforeFilter.filter((recipe) =>
        matchesPrepTime(recipe.duration, option.value),
      ).length;
      return count > 0;
    });
    const source = applyFilters(recipesBeforeFilter, activeFilters, "prepTime");

    const options = withSelectedOption(
      baselineOptions.map((option) => ({
        value: option.value,
        label: option.label,
        count: source.filter((recipe) => matchesPrepTime(recipe.duration, option.value)).length,
      })),
      prepTime,
      prepTime ? prepTimeOptions.find((option) => option.value === prepTime)?.label : undefined,
    );

    const availableCount = options.filter((option) => option.count > 0).length;
    return { options, baselineCount: baselineOptions.length, availableCount };
  }, [recipesBeforeFilter, cuisine, ingredient, cookingStyle, diet, prepTime]);

  const setSearchFilter = <K extends keyof RecipeSearch>(
    key: K,
    value: RecipeSearch[K] | undefined,
  ) => {
    void navigate({
      to: "/recipes",
      replace: true,
      search: (prev) => ({
        ...prev,
        [key]: value,
      }),
    });
  };

  const clearFilters = () => {
    void navigate({
      to: "/recipes",
      replace: true,
      search: (prev) => ({
        ...prev,
        cuisine: undefined,
        ingredient: undefined,
        cookingStyle: undefined,
        diet: undefined,
        prepTime: undefined,
      }),
    });
  };

  const hasActiveFilters = Boolean(cuisine || ingredient || cookingStyle || diet || prepTime);

  return (
    <section className="space-y-10 pb-12">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold leading-tight sm:text-6xl">
            {search ? `Results for "${search}"` : data.content.title}
          </h1>
          <p className="max-w-xl text-lg text-[color:var(--color-muted)]">
            {isIndexLoading
              ? "Loading recipes..."
              : search
                ? `${recipes.length} matching recipes curated for your search.`
                : data.content.description}
          </p>
        </div>
      </section>

      <section className="flex flex-wrap items-center gap-3">
        <span className="pr-1 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--color-muted)]">
          Filter by
        </span>

        {cuisineFacet.baselineCount > 0 ? (
          <Select
            label="Cuisine"
            options={cuisineFacet.options.map((option) => ({
              value: option.value,
              label: option.label,
              disabled: option.count === 0,
            }))}
            value={cuisine}
            disabled={cuisineFacet.availableCount === 0}
            onChange={(value) => setSearchFilter("cuisine", value)}
          />
        ) : null}

        {ingredientFacet.baselineCount > 0 ? (
          <Select
            label="Ingredient"
            options={ingredientFacet.options.map((option) => ({
              value: option.value,
              label: option.label,
              disabled: option.count === 0,
            }))}
            value={ingredient}
            disabled={ingredientFacet.availableCount === 0}
            onChange={(value) => setSearchFilter("ingredient", value)}
          />
        ) : null}

        {cookingStyleFacet.baselineCount > 0 ? (
          <Select
            label="Cooking Style"
            options={cookingStyleFacet.options.map((option) => ({
              value: option.value,
              label: option.label,
              disabled: option.count === 0,
            }))}
            value={cookingStyle}
            disabled={cookingStyleFacet.availableCount === 0}
            onChange={(value) => setSearchFilter("cookingStyle", value)}
          />
        ) : null}

        {dietFacet.baselineCount > 0 ? (
          <Select
            label="Diet"
            options={dietFacet.options.map((option) => ({
              value: option.value,
              label: option.label,
              disabled: option.count === 0,
            }))}
            value={diet}
            disabled={dietFacet.availableCount === 0}
            onChange={(value) =>
              setSearchFilter(
                "diet",
                value === "vegetarian" || value === "vegan" ? value : undefined,
              )
            }
          />
        ) : null}

        {durationFacet.baselineCount > 0 ? (
          <Select
            label="Duration"
            options={durationFacet.options.map((option) => ({
              value: option.value,
              label: option.label,
              disabled: option.count === 0,
            }))}
            value={prepTime}
            disabled={durationFacet.availableCount === 0}
            onChange={(value) => setSearchFilter("prepTime", value as RecipeSearch["prepTime"])}
          />
        ) : null}

        {hasActiveFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-medium text-[color:var(--color-primary)] underline-offset-2 hover:underline"
          >
            Clear all
          </button>
        ) : null}
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <Link
            key={recipe.slug}
            to="/recipes/$slug"
            params={{ slug: recipe.slug }}
            className="group block space-y-3"
          >
            <BlurrableImage image={recipe.image} variant="preview" aspectRatio="square" lazy />
            <div className="space-y-1">
              <h3 className="text-xl font-semibold leading-tight transition-colors group-hover:text-[color:var(--color-primary)]">
                {recipe.title}
              </h3>
              <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-[color:var(--color-muted)]">
                {recipe.duration ? <span>{recipe.duration}</span> : null}
                {recipe.duration && recipe.tag ? (
                  <span className="h-1 w-1 rounded-full bg-[color:var(--color-border)]" />
                ) : null}
                {recipe.tag ? <span>{recipe.tag}</span> : null}
              </div>
            </div>
          </Link>
        ))}
      </section>
      {!isIndexLoading && recipes.length === 0 ? (
        <p className="text-sm text-[color:var(--color-muted)]">
          No recipes match the current search and filters.
        </p>
      ) : null}
    </section>
  );
};

export const Route = createFileRoute("/recipes/")({
  loader: () => getRecipesPageData(),
  validateSearch: (search: Record<string, unknown>): RecipeSearch => {
    const ingredient = toSingleString(search.ingredient);
    const rawDiet = toSingleString(search.diet);
    const diet = rawDiet ? normalize(rawDiet) : undefined;

    return {
      search: typeof search.search === "string" ? search.search : undefined,
      cuisine: typeof search.cuisine === "string" ? search.cuisine : undefined,
      ingredient:
        typeof ingredient === "string" && ingredient.trim().length > 0
          ? ingredient.trim()
          : undefined,
      cookingStyle: typeof search.cookingStyle === "string" ? search.cookingStyle : undefined,
      diet: diet === "vegetarian" || diet === "vegan" ? diet : undefined,
      prepTime:
        search.prepTime === "under-30" ||
        search.prepTime === "30-60" ||
        search.prepTime === "60-plus"
          ? search.prepTime
          : undefined,
    };
  },
  component: RecipesPage,
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.content.title ?? "Wizard Food | Recipes" },
      {
        name: "description",
        content: loaderData?.content.description ?? "Browse and search Wizard Food recipes.",
      },
      {
        property: "og:title",
        content: loaderData?.content.title ?? "Wizard Food | Recipes",
      },
      {
        property: "og:description",
        content:
          loaderData?.content.openGraphDescription ??
          loaderData?.content.description ??
          "Browse and search Wizard Food recipes.",
      },
    ],
  }),
});
