<template>
  <div class="servings-adjuster">
    <div class="servings-adjuster__control">
      <v-button
        :disabled="servings <= 1"
        size="inline"
        aria-label="Decrease servings"
        transparent
        @click="decrementServings"
      >
        <span class="servings-adjuster__icon" aria-hidden="true">−</span>
      </v-button>
      <span>
        <span class="servings-adjuster__amount"
          ><b>{{ servings }}&nbsp;</b></span
        >
        <span class="servings-adjuster__servings">{{ label }}</span>
      </span>
      <v-button size="inline" aria-label="Increase servings" transparent @click="incrementServings">
        <span class="servings-adjuster__icon" aria-hidden="true">+</span>
      </v-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import VButton from "@/components/VButton.vue";

const props = withDefaults(
  defineProps<{
    servings: number;
    singularLabel: string | undefined;
    pluralLabel: string | undefined;
  }>(),
  {
    singularLabel: "serving",
    pluralLabel: "servings",
  },
);


const emit = defineEmits<{
  input: [value: number];
}>();


const label = computed(() => (props.servings > 1 ? props.pluralLabel : props.singularLabel));


function decrementServings() {
  if (props.servings > 1) {
    emit("input", props.servings - 1);
  }
}


function incrementServings() {
  emit("input", props.servings + 1);
}
</script>

<style lang="scss" scoped>
@use "../styles/mixins" as m;
@use "../styles/variables" as v;
.servings-adjuster {
  display: flex;
  align-items: center;
  @include m.spacing("gx", "xs");

  &__control {
    display: flex;
    align-items: center;
    user-select: none;
    .servings-adjuster__icon {
      color: var(--theme-color-primary);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      line-height: 1;
      font-size: 2rem;
      font-weight: v.$font-weight-bold;
    }
  }
  &__amount {
    text-align: right;
    display: inline-block;
    // Reserve space for larger numbers to avoid minus icon jumping around
    min-width: 1.7em;
  }
  &__servings {
    // Match extra space on the left side reserved for larger numbers
    margin-right: 0.7em;
  }
}
</style>
