import { JSONContent } from "@tiptap/core";
import { generateHTML } from "@tiptap/html";
import { InlineIngredientRelation } from "common/types/serverRecipe";
import { useDirectus } from "~/composables/useDirectus";
import extensions from "~/content/extensions";
import { RecipeMapper } from "~/mapping/recipeMapper";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const slug = getRouterParam(event, "slug");

  const directusClient = useDirectus({
    url: config.baseUrl,
    clientId: config.cfAccessClientId,
    clientSecret: config.cfAccessClientSecret,
  });

  const recipe = await directusClient.getRecipe(slug!);

  if (!recipe) {
    throw createError({
      statusCode: 404,
      statusMessage: "Recipe not found",
    });
  }

  recipe.instructionGroups.forEach((ig) => {
    ig.instructions.forEach((i) => {
      if (!i.text) {
        i.html = "";
        console.warn("Recipe", recipe!.title, "includes an instruction with no value. Instruction: ", i.id);
        return;
      }

      // TODO: Pick/delete so that the unused fields are not delivered to the client
      i.text = insertRelationDataIntoContent(i.text, i.inline_ingredients);
      i.html = generateHTML(i.text, extensions);
    });
  });

  return RecipeMapper.toClientRecipe(recipe);
});

function insertRelationDataIntoContent(content: JSONContent, inlineIngredients: InlineIngredientRelation[]) {
  if (content.type === "inline-relation" && content.attrs?.id) {
    const ingredient = inlineIngredients.find((i) => i.id === content.attrs!.id);
    content.attrs.data = ingredient?.ingredient_id;
  }

  content.content?.forEach((con) => insertRelationDataIntoContent(con, inlineIngredients));
  return content;
}
