<template>
  <n-form size="large">
    <h3>Ingredients</h3>
    <n-card
      v-for="(ingredientGroup, groupIndex) in recipeStore.ingredientGroups"
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
        v-for="(ingredient, ingredientIndex) in ingredientGroup.ingredients" :key="ingredient.uuid"
        :amount="ingredient.amount"
        :unit="ingredient.unit"
        :name="ingredient.name"
        :note="ingredient.note"
        :unit-options="units"
        :ref="`ingredientGroups${groupIndex}`"
        @input="handleIngredientInputAtIndex($event, groupIndex, ingredientIndex)"
      >
        <template v-slot:end>
          <n-button class="list-item__close" :bordered="false" @click="removeIngredientFromGroup(groupIndex, ingredientIndex)">
            <x-icon fa-icon="fa-xmark" />
          </n-button>
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
        <n-button type="primary" block tertiary @click="addIngredientToGroup(groupIndex, 'amount')">Add Ingredient</n-button>
      </x-row>
    </n-card>
    <n-button class="editor__add-section" type="primary" block tertiary @click="addIngredientGroup">New Ingredient Section</n-button>
    <h3>Instructions</h3>
    <n-card
      v-for="(instructionGroup, groupIndex) in recipeStore.instructionGroups"
      segmented
      :key="instructionGroup.uuid"
      @close="removeInstructionGroup(groupIndex)"
    >
      <template v-slot:header>
        <x-row>
          <x-column col-12 col-md-6>
            <x-input
              path="label"
              label="Section Title (optional)"
              :value="instructionGroup.label"
              @input="handleInstructionGroupTitleChange($event, groupIndex)"
            />
          </x-column>
        </x-row>
      </template>
      <template v-slot:header-extra>
        <n-button :bordered="false" @click="removeInstructionGroup(groupIndex)">
          <x-icon fa-icon="fa-xmark" />
        </n-button>
      </template>
      <instruction
        v-for="(instruction, instructionIndex) in instructionGroup.instructions"
        :key="instruction.uuid"
        :prefix="instructionIndex + 1 + '.'"
        :label="instruction.label"
        :ref="`instructionGroups${groupIndex}`"
        @input="handleInstructionInputAtIndex($event, groupIndex, instructionIndex)"
      >
        <template v-slot:end>
          <n-button class="list-item__close" :bordered="false" @click="removeInstructionFromGroup(groupIndex, instructionIndex)">
            <n-space align="center">
              <x-icon fa-icon="fa-xmark" />
            </n-space>
          </n-button>
        </template>
      </instruction>
      <!-- Ghost row to create new rows. These components are never used for real data. -->
      <x-row class="ghost">
        <x-column col-11>
          <x-input
            label="Instruction"
            path=""
            value=""
            :prefix="recipeStore.instructionGroups[groupIndex].instructions.length + 1 + '.'"
            :show-label="instructionGroup.instructions.length === 0"
            :show-error="false"
            @focus="addInstructionToGroup(groupIndex, 'label')"
          />
        </x-column>
      </x-row>
      <x-row class="mobile">
        <n-button type="primary" block tertiary @click="addInstructionToGroup(groupIndex, 'label')">Add Ingredient</n-button>
      </x-row>
    </n-card>
    <n-button class="editor__add-section" type="primary" block tertiary @click="addInstructionGroup">New Instruction Section</n-button>
  </n-form>
</template>

<script>
import { XInput, XIcon, XRow, XColumn, XSelect } from "@/components";
import { NForm, NButton, NCard } from "naive-ui";
import { useRecipeStore } from "@/store/recipeStore";
import { recipeFormSteps } from "@/constants/enums";
import { useVuelidate } from "@vuelidate/core";
import { uuid } from "vue-uuid";
import Ingredient from "@/views/Editor/Ingredient.vue";
import Instruction from "@/views/Editor/Instruction.vue";
import { nextTick } from "vue";

export default {
  name: "EditorIngredientsAndInstructions",
  components: {
    XRow,
    XColumn,
    Ingredient,
    Instruction,
    XInput,
    XSelect,
    XIcon,
    NForm,
    NButton,
    NCard,
  },
  props: {
    units: {
      type: Array,
      required: true,
    },
  },
  setup() {
    const recipeStore = useRecipeStore();
    const step = recipeFormSteps.ingredientsAndInstructions;
    return {
      recipeStore,
      v$: useVuelidate(),
      step,
    };
  },
  methods: {
    async handleIngredientGroupTitleChange(event, groupIndex) {
      this.recipeStore.setValueAt(["ingredientGroups", `${groupIndex}`, "name"], event.value);
    },
    async handleIngredientInputAtIndex(event, groupIndex, ingredientIndex) {
      this.recipeStore.setValueAt(["ingredientGroups", `${groupIndex}`, "ingredients", `${ingredientIndex}`, event.path], event.value);
    },
    handleInstructionGroupTitleChange(event, groupIndex) {
      this.recipeStore.setValueAt(["instructionGroups", `${groupIndex}`, "label"], event.value);
    },
    handleInstructionInputAtIndex(event, groupIndex, instructionIndex) {
      this.recipeStore.setValueAt(["instructionGroups", `${groupIndex}`, "instructions", `${instructionIndex}`, event.path], event.value);
    },
    addIngredientGroup() {
      this.recipeStore.ingredientGroups.push({
        uuid: uuid.v1(),
        name: "",
        ingredients: [],
      });
    },
    async addIngredientToGroup(groupIndex, touchedField) {
      this.recipeStore.ingredientGroups[groupIndex].ingredients.push({
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
    addInstructionGroup() {
      this.recipeStore.instructionGroups.push({
        uuid: uuid.v1(),
        label: "",
        instructions: [],
      });
    },
    async addInstructionToGroup(groupIndex, touchedField) {
      this.recipeStore.instructionGroups[groupIndex].instructions.push({
        uuid: uuid.v1(),
        label: "",
      });
      await nextTick();
      const currentGroupInstructions = this.$refs[`instructionGroups${groupIndex}`];
      currentGroupInstructions[currentGroupInstructions.length - 1].$refs[touchedField].selectSelf();
    },
    removeIngredientGroup(groupIndex) {
      this.recipeStore.ingredientGroups.splice(groupIndex, 1);
    },
    removeIngredientFromGroup(groupIndex, ingredientIndex) {
      this.recipeStore.ingredientGroups[groupIndex].ingredients.splice(ingredientIndex, 1);
    },
    removeInstructionGroup(groupIndex) {
      this.recipeStore.instructionGroups.splice(groupIndex, 1);
    },
    removeInstructionFromGroup(groupIndex, instructionIndex) {
      this.recipeStore.instructionGroups[groupIndex].instructions.splice(instructionIndex, 1);
    },
  },
};
</script>

<style scoped lang="scss">
@use "@/styles/mixins" as m;
.n-form {
  display: flex;
  flex-direction: column;
  @include m.spacing("gy", "sm");
}
</style>