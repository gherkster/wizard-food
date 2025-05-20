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
        <icon name="mynaui:minus-square" :size="40" />
      </v-button>
      <span>
        <span class="servings-adjuster__amount"
          ><b>{{ servings }}&nbsp;</b></span
        >
        <span class="servings-adjuster__servings">{{ label }}</span>
      </span>
      <v-button size="inline" aria-label="Increase servings" transparent @click="incrementServings">
        <icon name="mynaui:plus-square" :size="40" />
      </v-button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    servings: number;
    label?: string;
  }>(),
  {
    label: "servings",
  },
);

const emit = defineEmits<{
  input: [value: number];
}>();

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
@use "@/styles/mixins" as m;
@use "@/styles/variables" as v;
.servings-adjuster {
  display: flex;
  align-items: center;
  @include m.spacing("gx", "xs");

  &__control {
    display: flex;
    align-items: center;
    user-select: none;
    .icon {
      color: var(--theme-color-primary);
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
