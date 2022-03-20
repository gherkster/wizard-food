<template>
  <div>
    <v-row v-for="(item, index) in items" :key="item.uuid">
      <v-text-field
        v-if="item.itemType === 'section'"
        label="Section"
        v-model="item.label"
        :rules="[rules.required('Section')]"
      />
      <template v-else>
        <v-text-field :label="itemLabel" v-model="item.label" :rules="[rules.required(itemLabel)]" />
        <v-text-field v-if="hasNote" label="Notes" v-model="item.note" />
      </template>
      <v-btn @click="removeItem(index)">Remove item</v-btn>
    </v-row>
    <v-btn @click="addItemSection">Add {{ itemLabel }} section</v-btn>
    <v-btn @click="addItem">Add {{ itemLabel }}</v-btn>
  </div>
</template>

<script>
import { uuid } from "vue-uuid";
import { isRequired } from "@/scripts/validations";

export default {
  name: "ItemList",
  data: () => ({
    items: [],
    rules: {
      required(labelName) {
        return (value) => isRequired(value, `${labelName} is required`);
      },
    },
  }),
  props: {
    itemLabel: {
      type: String,
      default: "",
      required: true,
    },
    hasNote: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  methods: {
    addItemSection() {
      this.items.push({
        uuid: uuid.v1(),
        itemType: "section",
        label: "",
        note: "",
      });
      this.$emit("input", this.items);
    },
    addItem() {
      this.items.push({
        uuid: uuid.v1(),
        itemType: "item",
        label: "",
        note: "",
      });
      this.$emit("input", this.items);
    },
    removeItem(index) {
      this.items.splice(index, 1);
      this.$emit("input", this.items);
    },
  },
};
</script>

<style scoped></style>
