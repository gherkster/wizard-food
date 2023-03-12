<template>
  <n-form size="large">
    <n-card
      v-for="(ingredientGroup, groupIndex) in recipeStore.recipe.ingredientGroups"
      segmented
      :key="ingredientGroup.uuid"
      @close="removeIngredientGroup(groupIndex)"
    >
      <template v-slot:header>
        <x-row>
          <x-column col-12 col-md-6>
            <x-input
              path="name"
              label="Section Title (optional)"
              :value="ingredientGroup.name"
              @input="handleIngredientGroupTitleChange($event, groupIndex)"
            />
          </x-column>
        </x-row>
      </template>
      <template v-slot:header-extra>
        <n-button :bordered="false" @click="removeIngredientGroup(groupIndex)">
          <x-icon fa-icon="fa-xmark" />
        </n-button>
      </template>
      <recipe-ingredient
        v-for="(ingredient, ingredientIndex) in ingredientGroup.ingredients"
        :key="ingredient.uuid"
        :ingredient="ingredient"
        :unit-options="props.units"
        :ref="`ingredientGroups${groupIndex}`"
        @input="handleIngredientInputAtIndex($event, groupIndex, ingredientIndex)"
      >
        <template v-slot:end>
          <!-- Force top label to be displayed on first row where other item labels are also displayed to keep aligned -->
          <n-form-item :label="ingredientIndex === 0 ? ' ' : ''" class="list-item__end">
            <x-icon class="list-item__close" fa-icon="fa-xmark" @click="removeIngredientFromGroup(groupIndex, ingredientIndex)" />
          </n-form-item>
        </template>
      </recipe-ingredient>
      <!-- Ghost row to create new rows. These components are never used for real data. -->
      <x-row class="ghost">
        <x-column col-2>
          <x-input
            label="Amount"
            path=""
            value=""
            :show-label="ingredientGroup.ingredients.length === 0"
            :show-error="false"
            @focus="addIngredientToGroup(groupIndex)"
          />
        </x-column>
        <x-column col-2>
          <x-select
            label="Units"
            path=""
            value=""
            :options="[]"
            :show-label="ingredientGroup.ingredients.length === 0"
            :show-error="false"
            @focus="addIngredientToGroup(groupIndex)"
          />
        </x-column>
        <x-column col-4>
          <x-input
            label="Ingredient"
            path=""
            value=""
            :show-label="ingredientGroup.ingredients.length === 0"
            :show-error="false"
            @focus="addIngredientToGroup(groupIndex)"
          />
        </x-column>
        <x-column col-md-2 col-lg-3>
          <x-input
            label="Notes"
            path=""
            value=""
            :show-label="ingredientGroup.ingredients.length === 0"
            :show-error="false"
            @focus="addIngredientToGroup(groupIndex)"
          />
        </x-column>
      </x-row>
      <x-row class="mobile">
        <n-button type="primary" block tertiary class="editor__add-item" @click="addIngredientToGroup(groupIndex)">Add ingredient</n-button>
      </x-row>
    </n-card>
    <n-button class="editor__add-section" type="primary" block tertiary @click="addIngredientGroup">Add ingredient section</n-button>
  </n-form>
</template>

<script setup lang="ts">
import { XColumn, XIcon, XInput, XRow, XSelect } from "@/components";
import { NButton, NCard, NForm, NFormItem } from "naive-ui";
import { useRecipeStore } from "@/store/recipeStore";
import { onMounted } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { RecipeIngredient } from "@/views/editor/components";
import { Ingredient } from "@/types/recipe";

const props = defineProps({
  units: Array,
});

const recipeStore = useRecipeStore();
const v$ = useVuelidate();

onMounted(() => {
  if (recipeStore.recipe.ingredientGroups.length === 0) {
    addIngredientGroup();
  }
});

async function handleIngredientGroupTitleChange(value: string, groupIndex: number) {
  recipeStore.recipe.ingredientGroups[groupIndex].name = value;
}

function handleIngredientInputAtIndex(value: Ingredient, groupIndex: number, ingredientIndex: number) {
  recipeStore.recipe.ingredientGroups[groupIndex].ingredients[ingredientIndex] = value;
}

function addIngredientGroup() {
  recipeStore.recipe.ingredientGroups.push({
    name: "",
    ingredients: [],
  });
  // Pre-populate a new group with an ingredient to indicate what the group is used for
  addIngredientToGroup(recipeStore.recipe.ingredientGroups.length - 1);
}

async function addIngredientToGroup(groupIndex: number) {
  recipeStore.recipe.ingredientGroups[groupIndex].ingredients.push({
    amount: null,
    unit: "",
    name: "",
    note: "",
  });
}
function removeIngredientGroup(groupIndex: number) {
  recipeStore.recipe.ingredientGroups.splice(groupIndex, 1);
}

function removeIngredientFromGroup(groupIndex: number, ingredientIndex: number) {
  recipeStore.recipe.ingredientGroups[groupIndex].ingredients.splice(ingredientIndex, 1);
}
</script>

<style scoped lang="scss">
@use "@/styles/_mixins" as m;
.n-form {
  display: flex;
  flex-direction: column;
  @include m.spacing("gy", "sm");
}
</style>
