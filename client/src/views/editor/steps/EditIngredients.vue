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
      <ingredient
        v-for="(ingredient, ingredientIndex) in ingredientGroup.ingredients"
        :key="ingredient.uuid"
        :amount="ingredient.amount"
        :unit="ingredient.unit"
        :name="ingredient.name"
        :note="ingredient.note"
        :unit-options="units"
        :ref="`ingredientGroups${groupIndex}`"
        @input="handleIngredientInputAtIndex($event, groupIndex, ingredientIndex)"
        @blur="handleIngredientInputAtIndex($event, groupIndex, ingredientIndex)"
      >
        <template v-slot:end>
          <!-- Force top label to be displayed on first row where other item labels are also displayed to keep aligned -->
          <n-form-item :label="ingredientIndex === 0 ? ' ' : ''" class="list-item__end">
            <x-icon class="list-item__close" fa-icon="fa-xmark" @click="removeIngredientFromGroup(groupIndex, ingredientIndex)" />
          </n-form-item>
        </template>
      </ingredient>
      <!-- Ghost row to create new rows. These components are never used for real data. -->
      <x-row class="ghost">
        <x-column col-2>
          <x-input
            label="Amount"
            path=""
            value=""
            :show-label="ingredientGroup.ingredients.length === 0"
            :show-error="false"
            @focus="addIngredientToGroup(groupIndex, 'amount')"
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
            @focus="addIngredientToGroup(groupIndex, 'unit')"
          />
        </x-column>
        <x-column col-4>
          <x-input
            label="Ingredient"
            path=""
            value=""
            :show-label="ingredientGroup.ingredients.length === 0"
            :show-error="false"
            @focus="addIngredientToGroup(groupIndex, 'name')"
          />
        </x-column>
        <x-column col-md-2 col-lg-3>
          <x-input
            label="Notes"
            path=""
            value=""
            :show-label="ingredientGroup.ingredients.length === 0"
            :show-error="false"
            @focus="addIngredientToGroup(groupIndex, 'note')"
          />
        </x-column>
      </x-row>
      <x-row class="mobile">
        <n-button type="primary" block tertiary class="editor__add-item" @click="addIngredientToGroup(groupIndex, 'amount')"
          >Add ingredient</n-button
        >
      </x-row>
    </n-card>
    <n-button class="editor__add-section" type="primary" block tertiary @click="addIngredientGroup">Add ingredient section</n-button>
  </n-form>
</template>

<script>
import { XInput, XIcon, XRow, XColumn, XSelect } from "@/components";
import { NForm, NButton, NCard, NFormItem } from "naive-ui";
import { useRecipeStore } from "@/store/recipeStore";
import { recipeFormSteps } from "@/constants/enums";
import { uuid } from "vue-uuid";
import Ingredient from "@/views/editor/components/Ingredient.vue";
import { nextTick } from "vue";

export default {
  name: "EditIngredients",
  components: {
    XRow,
    XColumn,
    Ingredient,
    XInput,
    XSelect,
    XIcon,
    NForm,
    NButton,
    NCard,
    NFormItem,
  },
  props: {
    units: {
      type: Array,
      required: true,
    },
  },
  setup() {
    const recipeStore = useRecipeStore();
    const step = recipeFormSteps.ingredients;
    return {
      recipeStore,
      step,
    };
  },
  mounted() {
    if (this.recipeStore.recipe.ingredientGroups.length === 0) {
      this.addIngredientGroup();
    }
  },
  methods: {
    async handleIngredientGroupTitleChange(event, groupIndex) {
      this.recipeStore.setValueAt(["ingredientGroups", `${groupIndex}`, "name"], event.value);
    },
    async handleIngredientInputAtIndex(event, groupIndex, ingredientIndex) {
      this.recipeStore.setValueAt(["ingredientGroups", `${groupIndex}`, "ingredients", `${ingredientIndex}`, event.path], event.value);
    },
    addIngredientGroup() {
      this.recipeStore.recipe.ingredientGroups.push({
        uuid: uuid.v1(),
        name: "",
        ingredients: [],
      });
      // Pre-populate a new group with an ingredient to indicate what the group is used for
      this.addIngredientToGroup(this.recipeStore.recipe.ingredientGroups.length - 1, "amount");
    },
    async addIngredientToGroup(groupIndex, touchedField) {
      this.recipeStore.recipe.ingredientGroups[groupIndex].ingredients.push({
        uuid: uuid.v1(),
        amount: "",
        unit: "",
        name: "",
        note: "",
      });
      await nextTick();
      const currentGroupIngredients = this.$refs[`ingredientGroups${groupIndex}`];
      currentGroupIngredients[currentGroupIngredients.length - 1].$refs[touchedField].selectSelf();
    },
    removeIngredientGroup(groupIndex) {
      this.recipeStore.recipe.ingredientGroups.splice(groupIndex, 1);
    },
    removeIngredientFromGroup(groupIndex, ingredientIndex) {
      this.recipeStore.recipe.ingredientGroups[groupIndex].ingredients.splice(ingredientIndex, 1);
    },
  },
};
</script>

<style scoped lang="scss">
@use "@/styles/_mixins" as m;
.n-form {
  display: flex;
  flex-direction: column;
  @include m.spacing("gy", "sm");
}
</style>
