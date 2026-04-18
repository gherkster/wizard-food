<template>
  <div v-if="internalDuration" class="custom-duration--container">
    <v-input v-model="internalDuration.minutes" type="number" suffix="mins" :min="0" hide-arrows />
    <v-input v-model="internalDuration.hours" type="number" suffix="hrs" :min="0" hide-arrows />
    <v-input v-model="internalDuration.days" type="number" suffix="days" :min="0" hide-arrows />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRaw, watch } from "vue";

const props = defineProps<{
  value?: number | string;
  loading: boolean;
}>();

interface Duration {
  minutes: number;
  hours: number;
  days: number;
}

const internalDuration = ref<Duration>();

function init() {
  /**
   * Remove reactivity so that we can keep a reference to the initial state.
   * This is needed so the component can emit a numeric value for the database value,
   * but not have the input values jump around - e.g. entering 61 minutes instantly switching to 1 hour / 1 minute
   */
  const initialValue = toRaw(props.value);

  internalDuration.value = initialValue
    ? convertSecondsToDuration(initialValue)
    : {
        minutes: 0,
        hours: 0,
        days: 0,
      };

  const totalDuration = computed<number>(() => {
    return (
      internalDuration.value!.days * 24 * 60 * 60 +
      internalDuration.value!.hours * 60 * 60 +
      internalDuration.value!.minutes * 60
    );
  });

  watch(totalDuration, () => {
    emit("input", totalDuration.value);
  });
}

function convertSecondsToDuration(seconds: number | string) {
  const secondsNumber = typeof seconds === "string" ? parseInt(seconds, 10) : seconds;
  return {
    days: Math.floor(secondsNumber / (3600 * 24)),
    hours: Math.floor((secondsNumber % (3600 * 24)) / 3600),
    minutes: Math.floor((secondsNumber % 3600) / 60),
  };
}

watch(
  () => props.loading,
  (isLoading) => {
    if (!isLoading) {
      // Wait until the component has finished loading, because props.value will not exist until then
      init();
    }
  },
  {
    immediate: true,
  },
);

const emit = defineEmits<{
  (e: "input", v: number): void;
}>();
</script>

<style lang="css" scoped>
.custom-duration--container {
  display: flex;
  column-gap: 24px;
}
</style>
