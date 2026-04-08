<template>
  <div class="recipe__duration">
    <v-popover>
      <template #trigger>
        <span>
          Total <b>{{ total }}</b>
        </span>
      </template>
      <template #content>
        <ul>
          <li v-if="preparation">
            <span>
              Preparation <b>{{ preparation }}</b>
            </span>
          </li>
          <li v-if="cooking">
            <span>
              Cooking <b>{{ cooking }}</b>
            </span>
          </li>
          <li v-if="customDurationName && custom">
            <span>
              {{ customDurationName }}
              <b>{{ custom }}</b>
            </span>
          </li>
        </ul>
      </template>
    </v-popover>
  </div>
</template>

<script setup lang="ts">
import VPopover from "@/components/VPopover.vue";

defineProps<{
  total: string;
  preparation?: string;
  cooking?: string;
  custom?: string;
  customDurationName?: string;
}>();
</script>

<style lang="scss" scoped>
@use "../../styles/mixins" as m;

.recipe__duration {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  text-transform: capitalize;
  @include m.spacing("g", "xs");
}

ul {
  padding-left: 12px;
}
</style>
