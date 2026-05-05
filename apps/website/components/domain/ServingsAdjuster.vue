<script setup lang="ts">
import { css } from "styled-system/css";
import { token } from "styled-system/tokens";

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

const incrementServings = () => {
  emit("input", props.servings + 1);
};

const decrementServings = () => {
  if (props.servings > 1) {
    emit("input", props.servings - 1);
  }
};
</script>

<template>
  <div :class="css({ display: 'flex', alignItems: 'center', columnGap: 'xs' })">
    <div :class="css({ display: 'flex', alignItems: 'center', userSelect: 'none' })">
      <Button :disabled="servings <= 1" aria-label="Decrease servings" @click="decrementServings">
        <icon
          name="mynaui:minus-square"
          :size="36"
          :class="css({ color: token('colors.primary') })"
        />
      </Button>
      <span>
        <span
          :class="
            css({
              textAlign: 'right',
              display: 'inline-block',
              minWidth: '1.5em', // Reserve space for larger numbers to avoid minus icon jumping around
            })
          "
          ><b>{{ servings }}&nbsp;</b></span
        >
        <span
          :class="
            css({
              marginRight: ' 0.5em', // Match extra space on the left side reserved for larger numbers
            })
          "
          >{{ label }}</span
        >
      </span>
      <Button aria-label="Increase servings" @click="incrementServings">
        <icon
          name="mynaui:plus-square"
          :size="36"
          :class="css({ color: token('colors.primary') })"
        />
      </Button>
    </div>
  </div>
</template>
