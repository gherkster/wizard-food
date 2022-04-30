<template>
  <div>
    <v-row v-for="(item, index) in items" :key="item.uuid">
      <v-col cols="11" v-if="item.itemType === 'section'">
        <text-field
          label="Section name"
          path="label"
          :value="item.label"
          :error="getError('label', index)"
          @input="handleInput($event, index)"
        />
      </v-col>
      <template v-else>
        <v-col cols="2">
          <text-field
            v-if="hasAmount"
            label="Amount"
            path="amount"
            :value="item.amount"
            :error="getError('amount', index)"
            @input="handleInput($event, index)"
          />
        </v-col>
        <v-col cols="2">
          <combo-box
            v-if="hasUnits"
            label="Units"
            path="unit"
            :value="item.unit"
            :items="unitItems"
            :error="getError('unit', index)"
            @input="handleInput($event, index)"
          />
        </v-col>
        <v-col cols="4">
          <text-field
            :label="itemLabel"
            path="label"
            :value="item.label"
            :error="getError('label', index)"
            @input="handleInput($event, index)"
          />
        </v-col>
        <v-col cols="3">
          <text-field v-if="hasNote" label="Notes" path="note" :value="item.note" @input="handleInput($event, index)" />
        </v-col>
      </template>
      <v-col cols="1">
        <v-btn icon @click="removeItem(index)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <input-button label="Add Group" @click="addItemGroup" />
      </v-col>
      <v-col>
        <input-button :label="'Add ' + itemLabel" @click="addItem" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { uuid } from "vue-uuid";
import { isDecimal, isRequired } from "@/scripts/validation";
import ComboBox from "@/components/molecules/ComboBox";
import InputButton from "@/components/molecules/InputButton";
import TextField from "@/components/molecules/TextField";

export default {
  name: "ItemList",
  components: { TextField, InputButton, ComboBox },
  data: () => ({
    items: [],
    rules: {
      required(labelName) {
        return (value) => isRequired(value, `${labelName} is required`);
      },
      isDecimal(labelName) {
        return (value) => isDecimal(value, `${labelName} must be a number`);
      },
    },
  }),
  props: {
    path: {
      type: String,
      required: true,
    },
    errors: {
      required: false,
      default: () => [
        {
          amount: "",
          unit: "",
          label: "",
        },
      ],
    },
    hasAmount: {
      type: Boolean,
      default: false,
      required: false,
    },
    hasUnits: {
      // TODO: Remove if only using has-amount
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
      this.$emit("input", { path: this.path, value: this.items });
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
      this.$emit("input", { path: this.path, value: this.items });
    },
    removeItem(index) {
      this.items.splice(index, 1);
      this.$emit("input", { path: this.path, value: this.items });
    },
    handleInput(event, index) {
      this.items[index][event.path] = event.value;
      this.$emit("input", { path: this.path, value: this.items });
    },
    getError(name, index) {
      if (this.errors && this.errors[index] && this.errors[index][name]) {
        console.log("found error: ", this.errors[index][name]);
        return this.errors[index][name];
      } else {
        return "";
      }
    },
  },
};
</script>

<style scoped></style>
