<template>
  <div class="page content">
    <v-row>
      <v-column col-12 col-lg-12>
        <div v-if="recipe" class="recipe">
          <v-row class="wide-gap">
            <v-column v-if="recipe.coverImage" col-12 col-lg-4>
              <blurrable-image :img="recipe.coverImage" />
            </v-column>
            <v-column col-12 col-lg-8>
              <v-row>
                <h1>{{ recipe.title }}</h1>
              </v-row>
              <v-row>
                <div class="recipe__duration">
                  <span v-if="totalDuration"
                    >Total <b>{{ totalDuration }}</b></span
                  >
                  <span v-if="recipe.preparationDuration"
                    >Preparation <b>{{ formatMinutesAsDuration(recipe.preparationDuration) }}</b></span
                  >
                  <span v-if="recipe.cookingDuration"
                    >Cooking <b>{{ formatMinutesAsDuration(recipe.cookingDuration) }}</b></span
                  >
                  <span v-if="recipe.customDuration"
                    >{{ recipe.customDurationName }} <b>{{ formatMinutesAsDuration(recipe.customDuration) }}</b></span
                  >
                </div>
              </v-row>
              <v-row>
                <div class="recipe__tags">
                  <v-tag>{{ recipe.category }}</v-tag>
                  <v-tag>{{ recipe.cuisine }}</v-tag>
                  <v-tag v-for="tag in recipe.tags" :key="tag">{{ tag }}</v-tag>
                </div>
              </v-row>
            </v-column>
          </v-row>
          <v-row class="wide-gap">
            <v-column col-12 col-lg-4>
              <div v-if="recipe.ingredientGroups.length > 0" class="recipe__ingredients">
                <div class="recipe__ingredients-title">
                  <h2>Ingredients</h2>
                  <div class="recipe__multiplier">
                    <a :class="{ disabled: ingredientMultiplier <= 1 }" @click="decreaseMultiplier">-</a>
                    <h4>{{ ingredientMultiplier }}</h4>
                    <a @click="increaseMultiplier">+</a>
                  </div>
                </div>
                <div v-for="ingredientSection in recipe.ingredientGroups" :key="JSON.stringify(ingredientSection)">
                  <p v-if="ingredientSection.name">
                    <b>{{ ingredientSection.name }}</b>
                  </p>
                  <ul>
                    <li v-for="ingredient in ingredientSection.ingredients" :key="JSON.stringify(ingredient)">
                      <span>
                        {{ adjustIngredientByMultiplier(ingredient.amount) }} {{ ingredient.unit }}
                        {{ ingredient.name }}</span
                      >
                      <span v-if="ingredient.note" class="text-muted"
                        ><i>&nbsp;{{ ingredient.note }}</i></span
                      >
                    </li>
                  </ul>
                </div>
              </div>
            </v-column>
            <v-column col-12 col-lg-8>
              <div v-if="recipe.instructionGroups.length > 0" class="recipe__instructions">
                <h2>Instructions</h2>
                <div
                  v-for="instructionSection in recipe.instructionGroups"
                  :key="JSON.stringify(instructionSection)"
                  class="instruction-section"
                >
                  <p v-if="instructionSection.name">
                    <b>{{ instructionSection.name }}</b>
                  </p>
                  <div class="instruction-group">
                    <div
                      v-for="(instruction, index) in instructionSection.instructions"
                      :key="JSON.stringify(instruction)"
                      class="instruction"
                    >
                      <h4>{{ index + 1 }}.</h4>
                      <recipe-instruction
                        :content="instruction.text"
                        :ingredient-multiplier="ingredientMultiplier"
                        :original-number-of-servings="originalNumberOfServings"
                      />
                      <blurrable-image v-if="instruction.image" :img="instruction.image" />
                    </div>
                  </div>
                </div>
              </div>
            </v-column>
          </v-row>
          <v-row v-if="recipe.note" class="wide-gap">
            <v-column>
              <h2>Notes</h2>
              <div v-html="recipe.note" />
            </v-column>
          </v-row>
        </div>
      </v-column>
      <v-column col-12 col-lg-2> </v-column>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { RecipeMapper } from "~/mapping/recipeMapper";
import { useDirectus } from "~/composables/useDirectus";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import type { JSONContent } from "@tiptap/core";
import { generateHTML } from "@tiptap/html";
import type { InlineIngredientRelation } from "common/types/serverRecipe";
import extensions from "~/content/extensions";

const recipesResponse = await useAsyncData(async () => {
  const client = useDirectus();
  const route = useRoute();

  const recipe = await client.getRecipe(route.params.slug.toString());
  //console.log(JSON.stringify(recipe));
  recipe?.instructionGroups.forEach((ig) => {
    ig.instructions.forEach((i) => {
      if (!i.text) {
        i.html = "";
        //console.warn("Recipe", recipe.title, "includes an instruction with no value. Instruction: ", i.id);
        return;
      }

      // TODO: Pick/delete so that the unused fields are not delivered to the client
      i.text = insertRelationDataIntoContent(i.text, i.inline_ingredients);
      if (typeof window === "undefined" || typeof document === "undefined") {
        i.html = generateHTML(i.text, extensions);
      }
    });
  });

  // TODO Do mapping here so that mapping logic can live server side

  return recipe;
});

// TODO Check if this is sent to client
function insertRelationDataIntoContent(content: JSONContent, inlineIngredients: InlineIngredientRelation[]) {
  if (content.type === "inline-relation" && content.attrs?.id) {
    const ingredient = inlineIngredients.find((i) => i.id === content.attrs!.id);
    content.attrs.data = ingredient?.ingredient_id;
  }

  content.content?.forEach((con) => insertRelationDataIntoContent(con, inlineIngredients));
  return content;
}

if (recipesResponse.error.value) {
  throw createError({
    statusCode: 500,
    statusMessage: recipesResponse.error.value?.message,
  });
}

if (!recipesResponse.data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found!",
  });
}
const recipe = ref(RecipeMapper.toClientRecipe(recipesResponse.data.value!));

const ingredientMultiplier = ref<number>(
  recipe.value.servings && recipe.value.servings > 0 ? recipe.value.servings : 1,
);
const originalNumberOfServings = ingredientMultiplier.value;

const multipler = useIngredientMultiplier();
function adjustIngredientByMultiplier(amount?: number) {
  if (!amount) {
    return "";
  }
  return multipler.multiplyToFraction(amount, ingredientMultiplier.value, originalNumberOfServings);
}
function increaseMultiplier() {
  ingredientMultiplier.value++;
}
function decreaseMultiplier() {
  if (ingredientMultiplier.value > 1) {
    ingredientMultiplier.value--;
  }
}

const totalDuration = computed(() => {
  return formatMinutesAsDuration(
    (recipe.value.preparationDuration ?? 0) + (recipe.value.cookingDuration ?? 0) + (recipe.value.customDuration ?? 0),
  );
});
function formatMinutesAsDuration(seconds: number) {
  dayjs.extend(duration);
  const totalDuration = dayjs.duration(seconds, "seconds");

  const formatStrings = [];
  if (totalDuration.asDays() >= 1) {
    formatStrings.push("D[d]");
  }
  if (totalDuration.asHours() >= 1) {
    formatStrings.push("H[h]");
  }
  if (totalDuration.asMinutes() >= 1) {
    formatStrings.push("m[m]");
  }
  return totalDuration.format(formatStrings.join(" "));
}
</script>

<style lang="scss" scoped>
@use "../../styles/mixins" as m;
.instruction-group {
  display: flex;
  flex-direction: column;
}
.instruction {
  display: flex;
  @include m.spacing("gx", "sm");
  > h4 {
    margin: 0;
  }
}
</style>

<style lang="scss">
.instruction {
  p {
    margin-top: 0;
  }
}
.inline-ingredient {
  font-weight: bold;
}
</style>
