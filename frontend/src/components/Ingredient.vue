<template>
  <v-row>
    <v-col>
      <v-text-field label="Amount" v-model="model.amount" />
    </v-col>
    <v-col>
      <v-combobox label="Unit" :items="unitOptions" v-model="model.unit" />
    </v-col>
    <v-col>
      <v-text-field label="Ingredient" v-model="model.ingredient" />
    </v-col>
    <v-col>
      <v-text-field label="Note" v-model="model.note" />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "Ingredient",
  data: () => ({
    unitOptions: ["g", "kg", "tsp", "tbsp"],
    model: {
      amount: 0,
      unit: "",
      ingredient: "",
      note: "",
    },
  }),
};
</script>

<style scoped>

</style>