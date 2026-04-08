<template>
  <div
    v-for="instructionSection in recipe.instructionGroups"
    :key="`${instructionSection.name}-${instructionSection.instructions.length}`"
    class="instruction-section"
  >
    <p v-if="instructionSection.name">
      <b>{{ instructionSection.name }}</b>
    </p>
    <div class="instruction-group">
      <div
        v-for="(instruction, index) in instructionSection.instructions"
        :key="instruction.text"
        class="instruction"
      >
        <v-badge>{{ index + 1 }}</v-badge>
        <recipe-instruction
          :content="instruction.text"
          :ingredient-multiplier="servings"
          :original-number-of-servings="originalServings"
        />
        <blurrable-image
          v-if="instruction.image"
          :img="instruction.image"
          purpose="instruction"
          shape="square"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RecipePayload } from "@wizard/content/store";

import VBadge from "@/components/VBadge.vue";
import BlurrableImage from "@/components/BlurrableImage.vue";
import RecipeInstruction from "@/components/RecipeInstruction.vue";
import { useRecipeServingsState } from "@/composables/useRecipeServingsState";

const props = defineProps<{
  recipe: RecipePayload;
  recipeKey: string;
}>();

const initialServings = props.recipe.servings && props.recipe.servings > 0 ? props.recipe.servings : 1;
const { servings, originalServings } = useRecipeServingsState(props.recipeKey, initialServings);
</script>
