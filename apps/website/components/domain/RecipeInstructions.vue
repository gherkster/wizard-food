<script setup lang="ts">
import type { InstructionGroup } from "@wizard/content";
import { css } from "styled-system/css";

interface Props {
  instructionGroups: InstructionGroup[];
  selectedServings: number;
  originalServings: number;
}

defineProps<Props>();
</script>

<template>
  <div>
    <h2>Instructions</h2>

    <div :class="css({ display: 'flex', flexDirection: 'column', gap: 'sm' })">
      <div
        v-for="instructionGroup in instructionGroups"
        :key="`${instructionGroup.name}-${instructionGroup.instructions.length}`"
      >
        <Text
          v-if="instructionGroup.name"
          size="lg"
          weight="bold"
          is="div"
          :class="css({ mb: '0.8em' })"
        >
          {{ instructionGroup.name }}
        </Text>

        <div :class="css({ display: 'flex', flexDirection: 'column', rowGap: '1.2em' })">
          <div
            v-for="(instruction, index) in instructionGroup.instructions"
            :key="instruction.text"
            :class="css({ display: 'flex', columnGap: 'xs' })"
          >
            <VBadge>{{ index + 1 }}</VBadge>
            <RecipeInstruction
              :content="instruction.text"
              :selected-servings="selectedServings"
              :original-servings="originalServings"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
