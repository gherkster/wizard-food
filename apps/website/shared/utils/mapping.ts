export const mapToRecipe = (payload: RecipePayload): Recipe => {
  return {
    title: payload.title,
    description: payload.description,
    descriptionPlainText: payload.descriptionPlainText,
    descriptionSnippet: payload.descriptionSnippet,
    cuisine: payload.cuisine,
    course: payload.course,
    note: payload.note,
    coverImage: payload.coverImage,
    ingredientGroups: payload.ingredientGroups,
    instructionGroups: payload.instructionGroups,
    preparationDuration: payload.preparationDuration,
    cookingDuration: payload.cookingDuration,
    customDurationName: payload.customDurationName,
    customDuration: payload.customDuration,
    servings: payload.servings,
    servingsType: payload.servingsType,
    slug: payload.slug,
    tags: payload.tags,
    datePublished: payload.datePublished ? new Date(payload.datePublished) : undefined,
  };
};

export const mapToRecipePreview = (serverRecipe: RecipePayload): RecipePreview => {
  return {
    title: serverRecipe.title,
    descriptionSnippet: serverRecipe.descriptionSnippet,
    course: serverRecipe.course ?? undefined,
    cuisine: serverRecipe.cuisine ?? undefined,
    datePublished: serverRecipe.datePublished ? new Date(serverRecipe.datePublished) : undefined,
    favourite: serverRecipe.favourite ?? undefined,
    featuredTag: serverRecipe.featuredTag,
    preparationDuration: serverRecipe.preparationDuration ?? undefined,
    cookingDuration: serverRecipe.cookingDuration ?? undefined,
    customDurationName: serverRecipe.customDurationName ?? undefined,
    customDuration: serverRecipe.customDuration ?? undefined,
    totalDurationLabel: formatDuration(recipeTotalDuration(serverRecipe)),
    coverImage: serverRecipe.coverImage,
    slug: serverRecipe.slug,
    tags: serverRecipe.tags,
  };
};
