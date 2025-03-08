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
    servingsType: payload.servings_type,
    slug: payload.slug,
    tags: payload.tags,
    date_published: payload.date_published ? new Date(payload.date_published) : undefined,
  };
};

export const mapToRecipePreview = (serverRecipe: RecipePayload): RecipePreview => {
  return {
    title: serverRecipe.title,
    descriptionSnippet: serverRecipe.descriptionSnippet,
    course: serverRecipe.course ?? undefined,
    cuisine: serverRecipe.cuisine ?? undefined,
    date_published: serverRecipe.date_published ? new Date(serverRecipe.date_published) : undefined,
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
