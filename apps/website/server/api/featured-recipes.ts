import { loadAllRecipes, type Recipe, type RecipePreview, type RecipePromo } from "@wizard/content";

export default defineEventHandler(async () => {
  const recipesBySlug = await loadAllRecipes(".content");

  const recipes = Object.values(recipesBySlug);

  if (recipes.length === 0) {
    throw new Error("Failed to retrieve recipes");
  }

  // Keep track of what has been included in a category already to avoid doubling up
  const alreadyShownRecipes = new Set<string>();

  const now = new Date();

  const allLatestRecipes = recipes
    .sort(
      (a, b) =>
        (b.datePublished ? new Date(b.datePublished) : now).getTime() -
        (a.datePublished ? new Date(a.datePublished) : now).getTime(),
    )
    .slice(0, 5);

  allLatestRecipes.forEach((r) => alreadyShownRecipes.add(r.slug));

  const [promoLatestRecipe, ...nonPromoLatestRecipes] = allLatestRecipes;

  const allFavouriteRecipes = shuffle(recipes)
    .filter((r) => !alreadyShownRecipes.has(r.slug) && r.favourite)
    .slice(0, 3);

  allFavouriteRecipes.forEach((r) => alreadyShownRecipes.add(r.slug));

  const allQuickRecipes = shuffle(recipes)
    .filter((r) => {
      return (
        !alreadyShownRecipes.has(r.slug) &&
        r.course?.toLowerCase().startsWith("main") &&
        r.durationTotal?.minutes !== undefined &&
        r.durationTotal.minutes > 0 &&
        r.durationTotal.minutes <= 45
      );
    })
    .slice(0, 3);

  allQuickRecipes.forEach((r) => alreadyShownRecipes.add(r.slug));

  const [promoQuickRecipe, ...nonPromoQuickRecipes] = allQuickRecipes;

  const allWorldCuisineRecipes = shuffle(recipes)
    .filter(
      (r) =>
        !alreadyShownRecipes.has(r.slug) &&
        !!r.cuisine &&
        !["american", "australian"].includes(r.cuisine.toLowerCase()),
    )
    .slice(0, 3);

  return {
    latest: {
      promo: mapToRecipePromo(promoLatestRecipe!),
      recipes: nonPromoLatestRecipes.map(mapToRecipePreview),
    },
    favourite: {
      recipes: allFavouriteRecipes.map(mapToRecipePreview),
    },
    quick: {
      promo: mapToRecipePromo(promoQuickRecipe!),
      recipes: nonPromoQuickRecipes.map(mapToRecipePreview),
    },
    worldCuisine: {
      recipes: allWorldCuisineRecipes.map(mapToRecipePreview),
    },
  };
});

const mapToRecipePromo = (recipe: Recipe): RecipePromo => {
  return {
    course: recipe.course ?? undefined,
    coverImage: recipe.coverImage,
    cuisine: recipe.cuisine ?? undefined,
    description: recipe.descriptionSnippet,
    diets: recipe.diets,
    durationTotal: recipe.durationTotal,
    featuredTag: recipe.featuredTag,
    slug: recipe.slug,
    title: recipe.title,
  };
};

const mapToRecipePreview = (recipe: Recipe): RecipePreview => {
  return {
    course: recipe.course ?? undefined,
    cuisine: recipe.cuisine ?? undefined,
    descriptionSnippet: recipe.descriptionSnippet,
    diets: recipe.diets,
    durationTotal: recipe.durationTotal,
    featuredTag: recipe.featuredTag,
    previewImage: recipe.previewImage,
    slug: recipe.slug,
    title: recipe.title,
  };
};

function shuffle<Type>(items: Type[]): Type[] {
  return items
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}
