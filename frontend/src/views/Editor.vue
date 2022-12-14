<template>
  <div class="page">
    <div class="content editor">
      <div class="editor__header">
        <h2>{{ isEditingExistingRecipe ? "Edit Recipe" : "New Recipe" }}</h2>
        <n-button v-if="isEditingExistingRecipe" type="error" @click="confirmDelete">Delete Recipe</n-button>
      </div>
      <!-- Stepper Header -->
      <n-steps vertical :current="currentStepIndex + 1">
        <n-step title="Summary" />
        <n-step title="Ingredients & Instructions" />
        <n-step title="Time (optional)" />
        <n-step title="Metadata" />
      </n-steps>
      <div id="recipe-form">
        <!-- Stepper Step 1: Recipe Summary -->
        <template v-if="currentStep === steps.summary">
          <n-form size="large">
            <n-grid :cols="12" :x-gap="12">
              <n-form-item-gi label="Title" required :span="6" :validation-status="currentStepErrors?.title.status" :feedback="currentStepErrors?.title.message">
                <x-input path="title" :value="recipeStore.title" @input="handleTitleInput" @blur="handleBlur" />
              </n-form-item-gi>
              <n-form-item-gi label="Image" :span="6">
                <x-upload path="imageSrc" :value="recipeStore.imageSrc" />
              </n-form-item-gi>
              <n-form-item-gi label="Notes" :span="12">
                <x-input
                  path="note"
                  type="textarea"
                  :value="recipeStore.note"
                  :autosize="{ minRows: 4, maxRows: 12 }"
                  @input="handleInput"
                  @blur="handleBlur"
                />
              </n-form-item-gi>
            </n-grid>
          </n-form>
        </template>
        <!-- Stepper Step 2: Recipe Ingredients / Instructions -->
        <template v-else-if="currentStep === steps.ingredientsAndInstructions">
          <!-- eslint-disable-next-line vue/no-v-for-template-key-->
          <template v-for="(ingredientGroup, groupIndex) in recipeStore.ingredientGroups" :key="ingredientGroup.uuid">
            <n-form>
              <n-grid :cols="24" :x-gap="12">
                <n-form-item-gi :span="8" label="Section Title (optional)">
                  <x-input path="name" :value="ingredientGroup.name" @input="handleIngredientGroupTitleChange($event, groupIndex)" />
                </n-form-item-gi>
                <n-form-item-gi :span="16" />
                <!-- eslint-disable-next-line vue/no-v-for-template-key-->
                <template v-for="(ingredient, ingredientIndex) in ingredientGroup.ingredients" :key="ingredient.uuid">
                  <n-form-item-gi
                    :span="3"
                    label="Amount"
                    required
                    :validation-status="currentStepErrors?.ingredientGroups[groupIndex]?.ingredients[ingredientIndex]?.amount?.status"
                    :feedback="currentStepErrors?.ingredientGroups[groupIndex]?.ingredients[ingredientIndex]?.amount?.message"
                  >
                    <x-input
                      path="amount"
                      :value="ingredient.amount"
                      @input="handleIngredientInputAtIndex($event, groupIndex, ingredientIndex)"
                      @blur="handleIngredientBlurAtIndex($event, groupIndex, ingredientIndex)"
                    />
                  </n-form-item-gi>
                  <n-form-item-gi :span="4" label="Units">
                    <x-select
                      path="unit"
                      :value="ingredient.unit"
                      filterable
                      tag
                      :options="[
                        { label: 'g', value: 'g' },
                        { label: 'mL', value: 'mL' },
                      ]"
                      @input="handleIngredientInputAtIndex($event, groupIndex, ingredientIndex)"
                      @blur="handleIngredientInputAtIndex($event, groupIndex, ingredientIndex)"
                    />
                  </n-form-item-gi>
                  <n-form-item-gi
                    :span="8"
                    label="Ingredient"
                    required
                    :validation-status="currentStepErrors?.ingredientGroups[groupIndex]?.ingredients[ingredientIndex]?.name?.status"
                    :feedback="currentStepErrors?.ingredientGroups[groupIndex]?.ingredients[ingredientIndex]?.name?.message"
                  >
                    <x-input
                      path="name"
                      :value="ingredient.name"
                      @input="handleIngredientInputAtIndex($event, groupIndex, ingredientIndex)"
                      @blur="handleIngredientBlurAtIndex($event, groupIndex, ingredientIndex)"
                    />
                  </n-form-item-gi>
                  <n-form-item-gi :span="6" label="Notes">
                    <x-input
                      path="note"
                      :value="ingredient.note"
                      @input="handleIngredientInputAtIndex($event, groupIndex, ingredientIndex)"
                      @blur="handleIngredientBlurAtIndex($event, groupIndex, ingredientIndex)"
                    />
                  </n-form-item-gi>
                  <n-form-item-gi :span="1">
                    <n-button @click="removeIngredientFromGroup(groupIndex, ingredientIndex)">
                      <n-space align="center">
                        <x-icon fa-icon="fa-xmark" />
                      </n-space>
                    </n-button>
                  </n-form-item-gi>
                  <n-form-item-gi :span="2" />
                </template>
                <!-- Ghost row to create new rows. These components are never used for real data. -->
                <n-form-item-gi :span="3" label="Amount" class="ghost">
                  <x-input path="" value="" @focus="addIngredientToGroup(groupIndex)" />
                </n-form-item-gi>
                <n-form-item-gi :span="4" label="Units" class="ghost">
                  <x-input path="" value="" @focus="addIngredientToGroup(groupIndex)" />
                </n-form-item-gi>
                <n-form-item-gi :span="8" label="Ingredient" class="ghost">
                  <x-input path="" value="" @focus="addIngredientToGroup(groupIndex)" />
                </n-form-item-gi>
                <n-form-item-gi :span="6" label="Notes" class="ghost">
                  <x-input path="" value="" @focus="addIngredientToGroup(groupIndex)" />
                </n-form-item-gi>
              </n-grid>
            </n-form>
          </template>
          <n-grid :cols="24" :x-gap="12">
            <n-form-item-gi :span="21">
              <n-button block style="height: 100px" @click="addIngredientGroup">New Ingredient Section</n-button>
            </n-form-item-gi>
          </n-grid>
          <!-- eslint-disable-next-line vue/no-v-for-template-key-->
          <template v-for="(instructionGroup, groupIndex) in recipeStore.instructionGroups" :key="instructionGroup.uuid">
            <n-form>
              <n-grid :cols="24" :x-gap="12">
                <n-form-item-gi :span="8" label="Section Title (optional)">
                  <x-input path="label" :value="instructionGroup.label" @input="handleInstructionGroupTitleChange($event, groupIndex)" />
                </n-form-item-gi>
                <n-form-item-gi :span="16" />
                <!-- eslint-disable-next-line vue/no-v-for-template-key-->
                <template v-for="(instruction, instructionIndex) in instructionGroup.instructions" :key="instruction.uuid">
                  <n-form-item-gi
                    :span="21"
                    :validation-status="currentStepErrors?.instructionGroups[groupIndex]?.instructions[instructionIndex]?.label?.status"
                    :feedback="currentStepErrors?.instructionGroups[groupIndex]?.instructions[instructionIndex]?.label?.message"
                    :show-label="false"
                  >
                    <n-input-group>
                      <n-input-group-label>{{ instructionIndex + 1 + "." }}</n-input-group-label>
                      <x-input
                        path="label"
                        type="textarea"
                        :autosize="{ minRows: 1, maxRows: 6 }"
                        :value="instruction.label"
                        @input="handleInstructionInputAtIndex($event, groupIndex, instructionIndex)"
                        @blur="handleInstructionBlurAtIndex($event, groupIndex, instructionIndex)"
                      />
                    </n-input-group>
                  </n-form-item-gi>
                  <n-form-item-gi :span="1" :show-label="false">
                    <n-button @click="removeInstructionFromGroup(groupIndex, instructionIndex)">
                      <n-space align="center">
                        <x-icon fa-icon="fa-xmark" />
                      </n-space>
                    </n-button>
                  </n-form-item-gi>
                </template>
                <!-- Ghost row to create new rows. These components are never used for real data. -->
                <n-form-item-gi :span="21" :show-label="false" class="ghost">
                  <n-input-group>
                    <n-input-group-label>{{ recipeStore.instructionGroups[groupIndex].instructions.length + 1 + "." }}</n-input-group-label>
                    <x-input path="" value="" @focus="addInstructionToGroup(groupIndex)" />
                  </n-input-group>
                </n-form-item-gi>
              </n-grid>
            </n-form>
          </template>
          <n-grid :cols="24" :x-gap="12">
            <n-form-item-gi :span="21">
              <n-button block style="height: 100px" @click="addInstructionGroup">New Instruction Section</n-button>
            </n-form-item-gi>
          </n-grid>
        </template>
        <!-- Stepper Step 3: Recipe Time -->
        <template v-else-if="currentStep === steps.time">
          <n-form>
            <n-grid :cols="24" :x-gap="12">
              <n-form-item-gi :span="14" label="Preparation Time">
                <n-input-group>
                  <x-input
                    label="Minutes"
                    path="preparationTime.minutes"
                    :value="recipeStore.preparationTime.minutes"
                    @input="handleInput"
                    @blur="handleBlur"
                  />
                  <n-input-group-label>mins</n-input-group-label>
                  <x-input
                    label="Hours"
                    path="preparationTime.hours"
                    :value="recipeStore.preparationTime.hours"
                    @input="handleInput"
                    @blur="handleBlur"
                  />
                  <n-input-group-label>hours</n-input-group-label>
                  <x-input
                    label="Days"
                    path="preparationTime.days"
                    :value="recipeStore.preparationTime.days"
                    @input="handleInput"
                    @blur="handleBlur"
                  />
                  <n-input-group-label>days</n-input-group-label>
                </n-input-group>
              </n-form-item-gi>
              <n-form-item-gi :span="14" label="Cooking Time">
                <n-input-group>
                  <x-input
                    path="cookingTime.minutes"
                    :value="recipeStore.cookingTime.minutes"
                    @input="handleInput"
                    @blur="handleBlur"
                  />
                  <n-input-group-label>mins</n-input-group-label>
                  <x-input
                    path="cookingTime.hours"
                    :value="recipeStore.cookingTime.hours"
                    @input="handleInput"
                    @blur="handleBlur"
                  />
                  <n-input-group-label>hours</n-input-group-label>
                  <x-input
                    path="cookingTime.days"
                    :value="recipeStore.cookingTime.days"
                    @input="handleInput"
                    @blur="handleBlur"
                  />
                  <n-input-group-label>days</n-input-group-label>
                </n-input-group>
              </n-form-item-gi>
              <!-- eslint-disable-next-line vue/no-v-for-template-key-->
              <template v-for="(customTime, index) in recipeStore.customTimes" :key="customTime.uuid">
                <n-form-item-gi :span="14" label="Custom Time">
                  <n-input-group>
                    <x-input
                      label="Minutes"
                      path="minutes"
                      :value="customTime.minutes"
                      @input="handleCustomTimeInputAtIndex($event, index)"
                      @blur="handleCustomTimeBlurAtIndex($event, index)"
                    />
                    <n-input-group-label>mins</n-input-group-label>
                    <x-input
                      label="Hours"
                      path="hours"
                      :value="customTime.hours"
                      @input="handleCustomTimeInputAtIndex($event, index)"
                      @blur="handleCustomTimeBlurAtIndex($event, index)"
                    />
                    <n-input-group-label>hours</n-input-group-label>
                    <x-input
                      label="Days"
                      path="days"
                      :value="customTime.days"
                      @input="handleCustomTimeInputAtIndex($event, index)"
                      @blur="handleCustomTimeBlurAtIndex($event, index)"
                    />
                    <n-input-group-label>days</n-input-group-label>
                  </n-input-group>
                </n-form-item-gi>
                <n-form-item-gi :span="6" label="Label" :validation-status="currentStepErrors?.customTimes[index]?.name?.status" :feedback="currentStepErrors?.customTimes[index]?.name?.message">
                  <x-select
                    path="name"
                    filterable
                    tag
                    :value="customTime.name"
                    :options="customTimeTypes"
                    @input="handleCustomTimeInputAtIndex($event, index)"
                    @blur="handleCustomTimeBlurAtIndex($event, index)"
                  />
                </n-form-item-gi>
              </template>
              <n-form-item-gi :span="20">
                <n-button block @click="addCustomTimeGroup">Add Custom Time</n-button>
              </n-form-item-gi>
            </n-grid>
          </n-form>
        </template>
        <!-- Stepper Step 4: Recipe Metadata -->
        <template v-else-if="currentStep === steps.metadata">
          <n-form>
            <!-- Servings / Category / Cuisines / Nutrition -->
            <n-grid :cols="12" :x-gap="12">
              <n-form-item-gi :span="4" label="Category" required :validation-status="currentStepErrors?.category.status" :feedback="currentStepErrors?.category.message">
                <x-select
                  path="category"
                  filterable
                  tag
                  :value="recipeStore.category"
                  :options="categories"
                  @input="handleInput"
                  @blur="handleBlur"
                />
              </n-form-item-gi>
              <n-form-item-gi :span="8" />
              <n-form-item-gi :span="4" label="Cuisine" required :validation-status="currentStepErrors?.cuisine.status" :feedback="currentStepErrors?.cuisine.message">
                <x-select
                  path="cuisine"
                  filterable
                  tag
                  :value="recipeStore.cuisine"
                  :options="cuisines"
                  @input="handleInput"
                  @blur="handleBlur"
                />
              </n-form-item-gi>
              <n-form-item-gi :span="8" />
              <n-form-item-gi :span="2" label="No. of servings" :validation-status="currentStepErrors?.servings.status" :feedback="currentStepErrors?.servings.message">
                <x-input
                  path="servings"
                  :value="recipeStore.servings"
                  @input="handleInput"
                  @blur="handleBlur"
                />
              </n-form-item-gi>
            </n-grid>
            <!-- Tags / Slug -->
            <n-grid :cols="12" :x-gap="12">
              <n-form-item-gi :span="6" label="Tags">
                <x-select
                  path="tags"
                  filterable
                  tag
                  multiple
                  :value="recipeStore.tags"
                  :options="tags"
                  @input="handleInput"
                  @blur="handleBlur"
                />
              </n-form-item-gi>
              <n-form-item-gi :span="6" />
              <n-form-item-gi :span="6" label="URL Slug" required :validation-status="currentStepErrors?.slug.status" :feedback="currentStepErrors?.slug.message">
                <n-input-group>
                  <n-input-group-label>{{ recipeUrlPrefix }}</n-input-group-label>
                  <x-input
                    path="slug"
                    :value="recipeStore.slug"
                    @input="handleSlugInput"
                    @blur="handleBlur"
                  />
                  <n-button type="primary" ghost :loading="isSlugGenerating" @click="createSlug">Generate</n-button>
                </n-input-group>
              </n-form-item-gi>
            </n-grid>
          </n-form>
        </template>
      </div>
      <!-- Stepper Controls -->
      <x-row>
        <n-button type="primary" size="large" ghost v-if="currentStep !== steps.summary" @click="goToPreviousStep">Previous</n-button>
        <n-button type="primary" size="large" :disabled="currentStepContainsErrors" @click="goToNextStep">{{ submitButtonLabel }}</n-button>
      </x-row>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { NButton, NSteps, NStep, NForm, NGrid, NFormItemGi, NInputGroup, NInputGroupLabel, NSpace, useDialog } from "naive-ui";
import { getFormInitialErrorState, defaultErrorState, slugPattern } from "@/scripts/validation";
import { mapApiToRecipeStore, mapRecipeStoreToApi } from "@/scripts/mapping";
import { recipeFormSteps } from "@/constants/enums";
import { useRecipeStore } from "@/store/recipeStore";
import { object, string, number, array, ValidationError } from "yup";
import { get, set } from "lodash";
import { IntegerMessage, NumericMessage, PositiveMessage, RequiredMessage } from "@/constants/validationMessages";
import { useAlertStore } from "@/store/alertStore";
import { uuid } from "vue-uuid";
import { XIcon, XInput, XSelect, XRow, XUpload } from "@/components";
import apis from "@/constants/apis";

export default {
  name: "Editor",
  components: {
    XIcon,
    XUpload,
    XRow,
    NSteps,
    NStep,
    NForm,
    NGrid,
    XInput,
    NFormItemGi,
    NButton,
    XSelect,
    NSpace,
    NInputGroup,
    NInputGroupLabel,
  },
  setup() {
    const recipeStore = useRecipeStore();
    const alertStore = useAlertStore();
    const dialog = useDialog();
    return {
      recipeStore: recipeStore,
      alertStore: alertStore,
      steps: recipeFormSteps,
      dialog: dialog,
    };
  },
  data: () => ({
    validationSchema: null,
    timeOptions: ["minutes", "hours", "days"],
    customTimeTypes: [],
    categories: [],
    cuisines: [],
    tags: [],
    currentStep: recipeFormSteps.summary,
    isSlugGenerating: false,
    isSubmitting: false,
    existingRecipeId: null,
    errors: getFormInitialErrorState(),
  }),
  watch: {
    $route(to, from) {
      console.log("routed to", to, from);
      this.currentStep = recipeFormSteps.summary;
      // Clear all pre-filled inputs if navigating away to create a new recipe, otherwise populate with the existing recipe input values
      if (to.path === "/new") {
        this.recipeStore.$reset();
      } else if (this.$route.params.slug) {
        this.populateInputsWithExistingRecipe();
      }
    },
  },
  created() {
    if (this.$route.params.slug) {
      this.populateInputsWithExistingRecipe();
    }

    axios
      .get(apis.dropdownOptions)
      .then((response) => {
        this.categories = response.data.categories.map((c) => ({ label: c.label, value: c.label }));
        this.cuisines = response.data.cuisines.map((c) => ({ label: c.label, value: c.label }));
        this.customTimeTypes = response.data.customTimeTypes.map((ct) => ({ label: ct.label, value: ct.label }));
        this.tags = response.data.tags.map((t) => ({ label: t.label, value: t.label }));
      })
      .catch((error) => console.log(error));

    /**
     * Form validation transformation function used with number() fields to convert empty strings to undefined.
     * This is to avoid empty strings being considered an invalid number
     * @returns {undefined|*}
     */
    function emptyToUndefined(currentValue, originalValue) {
      return originalValue === "" ? undefined : currentValue;
    }

    this.validationSchema = {
      [recipeFormSteps.summary]: object().shape({
        title: string().label("Title").trim().required(RequiredMessage),
        note: string(),
      }),
      [recipeFormSteps.ingredientsAndInstructions]: object().shape({
        ingredientGroups: array().of(
          object({
            ingredients: array().of(
              object({
                amount: number()
                  .transform(emptyToUndefined)
                  .label("Amount")
                  .required(RequiredMessage)
                  .typeError(NumericMessage)
                  .positive(PositiveMessage),
                unit: string(),
                name: string().label("Ingredient").trim().required(RequiredMessage),
                note: string(),
              })
            ),
          })
        ),
        instructionGroups: array().of(
          object({
            instructions: array().of(
              object({
                label: string().label("Instruction").trim().required(RequiredMessage),
              })
            ),
          })
        ),
      }),
      [recipeFormSteps.time]: object().shape({
        preparationTime: object().shape({
          minutes: number().label("Minutes").transform(emptyToUndefined).typeError(NumericMessage).integer(IntegerMessage),
          hours: number().label("Hours").transform(emptyToUndefined).typeError(NumericMessage).integer(IntegerMessage),
          days: number().label("Days").transform(emptyToUndefined).typeError(NumericMessage).integer(IntegerMessage),
        }),
        cookingTime: object().shape({
          minutes: number().label("Minutes").transform(emptyToUndefined).typeError(NumericMessage).integer(IntegerMessage),
          hours: number().label("Hours").transform(emptyToUndefined).typeError(NumericMessage).integer(IntegerMessage),
          days: number().label("Days").transform(emptyToUndefined).typeError(NumericMessage).integer(IntegerMessage),
        }),
        customTimes: array().of(
          object({
            minutes: number().label("Minutes").transform(emptyToUndefined).typeError(NumericMessage).integer(IntegerMessage),
            hours: number().label("Hours").transform(emptyToUndefined).typeError(NumericMessage).integer(IntegerMessage),
            days: number().label("Days").transform(emptyToUndefined).typeError(NumericMessage).integer(IntegerMessage),
            name: string().when(["minutes", "hours", "days"], {
              is: (minutes, hours, days) => minutes || hours || days,
              then: (schema) => schema.label("Custom time type").trim().required(RequiredMessage),
            }),
          })
        ),
      }),
      [recipeFormSteps.metadata]: object().shape({
        category: string().label("Category").trim().required(RequiredMessage),
        cuisine: string().label("Cuisine").trim().required(RequiredMessage),
        servings: number().label("No. of servings").transform(emptyToUndefined).typeError(NumericMessage).positive(PositiveMessage),
        slug: string()
          .label("Slug")
          .required(RequiredMessage)
          .matches(
            slugPattern,
            "URL slug must be a unique combination of alphanumeric characters and hyphens, such as my-new-recipe or MyNewRecipe"
          )
          .test(
            "is-slug-unique",
            "Slug already exists. Enter a unique value or click the reload icon to generate one.",
            async (value, testContext) => {
              // Skip API validation of unique slug when user is still entering text.
              // This ensures there is no latency/overuse of endpoint and text regex can run,
              // while still validating when the blur event fires.
              if (!testContext.options.skipApiValidation && value.trim()) {
                return await this.validateSlug(value.trim());
              } else {
                return true;
              }
            }
          ),
        tags: array(),
      }),
    };
  },
  computed: {
    recipeUrlPrefix() {
      return window.location.host + "/recipes/";
    },
    isEditingExistingRecipe() {
      return !!this.$route.params.slug;
    },
    currentStepIndex() {
      return Object.keys(this.steps).indexOf(this.currentStep);
    },
    currentValidationSchema() {
      return this.validationSchema[this.currentStep];
    },
    currentStepErrors() {
      return this.errors[this.currentStep];
    },
    currentStepContainsErrors() {
      return JSON.stringify(this.currentStepErrors).includes("error");
    },
    isOnLastStep() {
      return this.currentStep === recipeFormSteps.metadata;
    },
    submitButtonLabel() {
      if (this.isOnLastStep) {
        return this.isEditingExistingRecipe ? "Update Recipe" : "Create Recipe";
      } else {
        return "Next";
      }
    },
  },
  methods: {
    populateInputsWithExistingRecipe() {
      axios
        .get(apis.recipes + this.$route.params.slug)
        .then((response) => {
          this.existingRecipeId = response.data.id;
          this.recipeStore.$patch({
            ...mapApiToRecipeStore(response.data),
          });
        })
        .catch((error) => console.log(error));
    },
    /**
     * Handle form input validation and store update
     * @param value {string | boolean} The changed field value
     * @param path {string} Dot separated store path of the changed field
     * @returns {Promise<void>}
     */
    async handleInput({ path, value }) {
      this.recipeStore.setValueAt(path, value);
      await this.validateAt(path);
    },
    async handleBlur(event) {
      await this.validateAt(event.path);
    },
    async handleTitleInput({ path, value }) {
      this.recipeStore.setValueAt(path, value);
      await this.validateAt(path);
      this.createSlugFromTitle();
    },
    /**
     * A separate input handler for slug input.
     * This avoids calling the validation endpoint for each keypress, and only validates on input blur.
     */
    async handleSlugInput(event) {
      this.recipeStore.setValueAt(event.path, event.value);
      await this.validateAt(event.path, true);
    },
    async handleIngredientGroupTitleChange(event, groupIndex) {
      this.recipeStore.setValueAt(["ingredientGroups", `${groupIndex}`, "name"], event.value);
    },
    async handleIngredientInputAtIndex(event, groupIndex, ingredientIndex) {
      this.recipeStore.setValueAt(["ingredientGroups", `${groupIndex}`, "ingredients", `${ingredientIndex}`, event.path], event.value);
      await this.validateIngredient(event, groupIndex, ingredientIndex);
    },
    async handleInstructionGroupTitleChange(event, groupIndex) {
      this.recipeStore.setValueAt(["instructionGroups", `${groupIndex}`, "label"], event.value);
    },
    async handleInstructionInputAtIndex(event, groupIndex, instructionIndex) {
      this.recipeStore.setValueAt(["instructionGroups", `${groupIndex}`, "instructions", `${instructionIndex}`, event.path], event.value);
      await this.validateInstruction(event, groupIndex, instructionIndex);
    },
    async handleIngredientBlurAtIndex(event, groupIndex, ingredientIndex) {
      await this.validateIngredient(event, groupIndex, ingredientIndex);
    },
    async handleInstructionBlurAtIndex(event, groupIndex, instructionIndex) {
      await this.validateInstruction(event, groupIndex, instructionIndex);
    },
    async validateIngredient(event, groupIndex, ingredientIndex) {
      await this.validateAt(`ingredientGroups[${groupIndex}].ingredients[${ingredientIndex}].${event.path}`);
    },
    async validateInstruction(event, groupIndex, instructionIndex) {
      await this.validateAt(`instructionGroups[${groupIndex}].instructions[${instructionIndex}].${event.path}`);
    },
    addIngredientGroup() {
      this.errors[recipeFormSteps.ingredientsAndInstructions].ingredientGroups.push({
        ingredients: [],
      });
      this.recipeStore.ingredientGroups.push({
        uuid: uuid.v1(),
        name: "",
        ingredients: [],
      });
    },
    addIngredientToGroup(groupIndex) {
      this.errors[recipeFormSteps.ingredientsAndInstructions].ingredientGroups[groupIndex].ingredients.push({
        amount: defaultErrorState,
        unit: defaultErrorState,
        name: defaultErrorState,
        note: defaultErrorState,
      });
      this.recipeStore.ingredientGroups[groupIndex].ingredients.push({
        uuid: uuid.v1(),
        amount: "",
        unit: "",
        name: "",
        note: "",
      });
    },
    addInstructionGroup() {
      this.errors[recipeFormSteps.ingredientsAndInstructions].instructionGroups.push({
        instructions: [],
      });
      this.recipeStore.instructionGroups.push({
        uuid: uuid.v1(),
        label: "",
        instructions: [],
      });
    },
    addInstructionToGroup(groupIndex) {
      this.errors[recipeFormSteps.ingredientsAndInstructions].instructionGroups[groupIndex].instructions.push({
        label: defaultErrorState,
      });
      this.recipeStore.instructionGroups[groupIndex].instructions.push({
        uuid: uuid.v1(),
        label: "",
      });
    },
    removeIngredientFromGroup(groupIndex, ingredientIndex) {
      this.recipeStore.ingredientGroups[groupIndex].ingredients.splice(ingredientIndex, 1);
      this.errors[recipeFormSteps.ingredientsAndInstructions].ingredientGroups[groupIndex].ingredients.splice(ingredientIndex, 1);
    },
    removeInstructionFromGroup(groupIndex, instructionIndex) {
      this.recipeStore.instructionGroups[groupIndex].instructions.splice(instructionIndex, 1);
      this.errors[recipeFormSteps.ingredientsAndInstructions].instructionGroups[groupIndex].instructions.splice(instructionIndex, 1);
    },
    async handleCustomTimeInputAtIndex(event, index) {
      this.recipeStore.setValueAt(["customTimes", index, event.path], event.value);
      await this.validateAt(`customTimes[${index}].${event.path}`);
    },
    async handleCustomTimeBlurAtIndex(event, index) {
      await this.validateAt(`customTimes[${index}].${event.path}`);
    },
    addCustomTimeGroup() {
      this.recipeStore.customTimes.push({
        uuid: uuid.v1(),
        days: "",
        hours: "",
        minutes: "",
        label: "",
      });
    },
    removeCustomTimeGroup(groupIndex) {
      this.recipeStore.customTimes.splice(groupIndex, 1);
    },
    async validateAt(field, skipApiValidation = false) {
      console.log("validating: ", field, "with value: ", get(this.recipeStore, field), "in section", this.currentStep);
      await this.currentValidationSchema
        .validateAt(field, this.recipeStore, { abortEarly: false, skipApiValidation: skipApiValidation })
        .then(() => {
          set(this.errors[this.currentStep], field, { message: "", status: null });
        })
        .catch((error) => {
          if (error instanceof ValidationError) {
            const validationErrors = error.inner.map((e) => ({ path: e.params.path.toString(), message: e.message }));

            // If errors are an array clear them out first, as we are setting specific properties
            // within the array which would hang around otherwise
            if (Array.isArray(get(this.errors[this.currentStep], error.path))) {
              set(this.errors[this.currentStep], error.path, []);
            }

            validationErrors.forEach((e) => {
              set(this.errors[this.currentStep], e.path, { message: e.message, status: "error" });
            });
          } else {
            console.log(error);
          }
        });

      // If one of the custom times is modified (minutes, hours, days), then validate the customTimeType.
      // This ensures the user sees the field is required as soon as one of the above fields is modified,
      // without needing to interact with the customTimeType field directly.
      if (field.includes("customTimes") && !field.includes("name")) {
        // e.g. Transform customTimes[0].minutes path into customTimes[0].name
        const customTimeLabelWithSameIndex = field.substring(0, field.lastIndexOf("]") + 1) + ".name";
        await this.validateAt(customTimeLabelWithSameIndex);
      }
    },
    async validateCurrentSection() {
      await this.currentValidationSchema
        .validate(this.recipeStore, { abortEarly: false })
        .then(() => {
          set(this.errors, this.currentStep, getFormInitialErrorState()[this.currentStep]);
        })
        .catch((error) => {
          if (error instanceof ValidationError) {
            const validationErrors = error.inner.map((e) => ({ path: e.params.path.toString(), message: e.message }));

            // If errors are an array clear them out first, as we are setting specific properties
            // within the array which would hang around otherwise
            if (Array.isArray(get(this.errors, error.path))) {
              set(this.errors[this.currentStep], error.path, []);
            }

            validationErrors.forEach((e) => {
              set(this.errors[this.currentStep], e.path, { message: e.message, status: "error" });
            });
          }
        });
    },
    /**
     * Generate a slug based on the recipe title, replacing spaces with hyphens
     */
    createSlugFromTitle() {
      this.recipeStore.slug = this.recipeStore.title
        .toLowerCase()
        .trim()
        .replace(/[^\w ]+/g, "")
        .replace(/ +/g, "-");
    },
    async validateSlug(slug) {
      let isValidSlug;
      await axios
        .get(apis.recipeSlugs, {
          params: {
            chosenSlug: slug,
          },
        })
        .then((response) => {
          // If the api suggests a different slug to the entered one then the entered one is invalid since it is already in use
          // If we are currently editing a recipe and the entered slug is the same as the existing one
          // (ie if the user triggers the field validation without changing the value) then the slug is also valid
          isValidSlug = response.data === slug || slug === this.$route.params.slug;
        })
        .catch((error) => console.log(error));

      return isValidSlug;
    },
    async createSlug() {
      this.isSlugGenerating = true;
      const chosenSlug = this.recipeStore.slug || this.createSlugFromTitle() || "recipe";
      await axios
        .get(apis.recipeSlugs, {
          params: {
            chosenSlug: chosenSlug,
          },
        })
        .then(async (response) => {
          if (response.data) {
            this.recipeStore.slug = response.data;
          }
        })
        .catch((error) => console.log(error))
        .finally(() => {
          this.isSlugGenerating = false;
        });
    },
    async submit() {
      this.isSubmitting = true;
      console.log(JSON.stringify(this.recipeStore));
      if (this.isEditingExistingRecipe) {
        await axios
          .put(apis.recipes + this.existingRecipeId, mapRecipeStoreToApi(this.recipeStore))
          .then(() => {
            this.alertStore.showSuccessAlert("Recipe updated!");
            this.$router.push(`/recipes/${this.recipeStore.slug}`);
          })
          .catch((error) => {
            this.alertStore.showErrorAlert("An error occurred while updating the recipe");
            console.log(error);
          })
          .finally(() => (this.isSubmitting = false));
      } else {
        await axios
          .post(apis.recipes, mapRecipeStoreToApi(this.recipeStore))
          .then(() => {
            this.alertStore.showSuccessAlert("Recipe created!");
            this.$router.push(`/recipes/${this.recipeStore.slug}`);
          })
          .catch((error) => {
            this.alertStore.showErrorAlert("An error occurred while creating the recipe");
            console.log(error);
          })
          .finally(() => (this.isSubmitting = false));
      }
    },
    confirmDelete() {
      this.dialog.warning({
        title: "Permanently delete recipe?",
        //content: "This will permanently delete the recipe.",
        positiveText: "Delete",
        negativeText: "No",
        closable: false,
        onPositiveClick: async () => await this.deleteRecipe(),
      });
    },
    async deleteRecipe() {
      await axios({
        method: "delete",
        url: apis.recipes + this.recipeStore.slug,
      }).then(() => {
        this.recipeStore.$reset();
        this.alertStore.showSuccessAlert("Recipe deleted");
      });
      this.$router.replace("/recipes");
    },
    async goToNextStep() {
      await this.validateCurrentSection();
      if (this.currentStepContainsErrors) {
        return;
      }
      switch (this.currentStep) {
        case recipeFormSteps.summary:
          this.currentStep = recipeFormSteps.ingredientsAndInstructions;
          break;
        case recipeFormSteps.ingredientsAndInstructions:
          this.currentStep = recipeFormSteps.time;
          break;
        case recipeFormSteps.time:
          this.currentStep = recipeFormSteps.metadata;
          break;
        case recipeFormSteps.metadata:
          await this.submit();
          break;
      }
    },
    goToPreviousStep() {
      switch (this.currentStep) {
        case recipeFormSteps.metadata:
          this.currentStep = recipeFormSteps.time;
          break;
        case recipeFormSteps.time:
          this.currentStep = recipeFormSteps.ingredientsAndInstructions;
          break;
        case recipeFormSteps.ingredientsAndInstructions:
          this.currentStep = recipeFormSteps.summary;
          break;
      }
    },
  },
};
</script>
