<template>
  <div class="servings-adjuster">
    <div class="servings-adjuster__control">
      <icon name="gravity-ui:minus" size="34" :class="{ disabled: servings <= 1 }" @click="decrementServings" />
      <span>
        <span
          ><b>{{ servings }}&nbsp;</b></span
        >
        <span>{{ label }}</span>
      </span>
      <icon name="gravity-ui:plus" size="34" @click="incrementServings" />
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
    @include m.spacing("gx", "xs");
    > svg {
      cursor: pointer;
      color: v.$colour-primary;
    }
    span {
      text-align: center;
      //min-width: 20px;
    }
    > .disabled {
      cursor: not-allowed;
      opacity: 50%;
    }
  }
}
</style>
