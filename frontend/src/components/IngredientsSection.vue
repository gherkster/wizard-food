<template>
  <v-expansion-panel>
    <v-expansion-panel-header>{{ model.title }}</v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-text-field label="Title" v-model="model.title" />
      <template v-for="(ingredient, index) in model.ingredients">
        <component :is="ingredient" :key="index" />
      </template>
      <v-btn block @click="addIngredient">Add ingredient</v-btn>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import Ingredient from "@/components/Ingredient";
export default {
  name: "IngredientsSection",
  components: { Ingredient },
  data: () => ({
    model: {
      title: "Section Title",
      ingredients: [],
    },
  }),
  methods: {
    addIngredient() {
      this.model.ingredients.push(Ingredient);
    },
  },
};
</script>

<style scoped>

</style>