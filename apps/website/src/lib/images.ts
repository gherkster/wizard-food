import type { Image, ImageVariant, RecipePreview } from "@wizard/content";

import type { SearchIndexRecipe } from "@/lib/search/search-types";

const createImage = (
  id: string,
  title: string,
  width: number,
  height: number,
  variant: ImageVariant,
): Image => {
  return {
    id,
    title,
    fileName: id,
    width,
    height,
    modifyDate: "",
    variants: {
      cover: {
        square: variant,
        portrait: variant,
      },
      preview: {
        square: variant,
        portrait: variant,
      },
      instruction: {
        square: variant,
        portrait: variant,
      },
    },
  };
};

export const previewToCardImage = (recipe: RecipePreview): Image => {
  return recipe.coverImage;
};

export const searchIndexToCardImage = (recipe: SearchIndexRecipe): Image => {
  return createImage(
    recipe.slug,
    `Picture of ${recipe.title}`,
    recipe.coverImage.width,
    recipe.coverImage.height,
    recipe.coverImage.previewSquare,
  );
};
