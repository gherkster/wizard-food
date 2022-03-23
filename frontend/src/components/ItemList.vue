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
        <v-text-field v-if="hasAmount" label="Amount" v-model="item.amount" :rules="[rules.required('Amount')]" />
        <v-combobox v-if="hasUnits" label="Units" v-model="item.unit" :items="unitItems" :rules="[rules.required('Unit')]" />
        <v-text-field :label="itemLabel" v-model="item.label" :rules="[rules.required(itemLabel)]" />
        <v-text-field v-if="hasNote" label="Notes" v-model="item.note" />
      </template>
      <v-btn icon @click="removeItem(index)">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-row>
    <v-btn @click="addItemGroup">Add {{ itemLabel }} group</v-btn>
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
    hasAmount: {
      type: Boolean,
      default: false,
      required: false,
    },
    hasUnits: {
      type: Boolean,
      default: false,
      required: false,
    },
    unitItems: {
      type: Array,
      default: () => [],
      required: false,
    },
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
    addItemGroup() {
      this.items.push({
        uuid: uuid.v1(),
        itemType: "section",
        label: "",
      });
      this.$emit("input", this.items);
    },
    addItem() {
      this.items.push({
        uuid: uuid.v1(),
        itemType: "item",
        label: "",
        ...(this.hasAmount && { amount: "" }),
        ...(this.hasUnits && { unit: "" }),
        ...(this.hasNote && { note: "" }),
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
