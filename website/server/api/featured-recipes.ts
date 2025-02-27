import { useDirectusApi } from "~/clients/useDirectusApi";
import { useRecipeFormatter } from "~/composables";

export default defineEventHandler(async () => {
  const client = useDirectusApi();

  const { data: recipes, error } = await client.getRecipes();

  if (error) {
    throw error;
  }

  if (!recipes) {
    throw new Error("Failed to get recipes from API");
  }

  // Track the recipes that have already been picked so far so that duplicates are not displayed
  const alreadyShownRecipes = new Set<string>();

  const now = new Date();

  const latestRecipes = recipes
    // A missing date_published value means the recipe is brand new and the publish date has not been set in the record yet, so use the current time.
    .sort((a, b) => (b.date_published ?? now).getTime() - (a.date_published ?? now).getTime())
    .slice(0, 3);
  latestRecipes.forEach((r) => alreadyShownRecipes.add(r.slug));

  const favouriteRecipes = shuffle(recipes)
    .filter((r) => !alreadyShownRecipes.has(r.slug) && r.favourite)
    .slice(0, 4);
  favouriteRecipes.forEach((r) => alreadyShownRecipes.add(r.slug));

  const formatter = useRecipeFormatter();

  const quickRecipes = shuffle(recipes)
    .filter((r) => {
      const totalDuration = formatter.recipeTotalDuration(r);
      return (
        !alreadyShownRecipes.has(r.slug) &&
        r.course?.toLowerCase().startsWith("main") &&
        totalDuration.asMinutes() > 0 &&
        totalDuration.asMinutes() <= 45
      );
    })
    .slice(0, 4);
  quickRecipes.forEach((r) => alreadyShownRecipes.add(r.slug));

  // TODO: Probably needs to cover more cuisines
  const worldCuisineRecipes = shuffle(recipes)
    .filter(
      (r) =>
        !alreadyShownRecipes.has(r.slug) && r.cuisine && !["american", "australian"].includes(r.cuisine.toLowerCase()),
    )
    .slice(0, 4);

  return {
    latestRecipes,
    favouriteRecipes,
    quickRecipes,
    worldCuisineRecipes,
  };
});

// https://stackoverflow.com/a/46545530
function shuffle<Type>(items: Type[]) {
  return items
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}
