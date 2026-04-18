<template>
  <v-card class="card">
    <v-card-title class="card-title">Link</v-card-title>
    <v-card-text>
      <div class="grid">
        <v-notice v-if="validationErrors.length" type="danger" class="field">
          <div>
            <p>$t:validation_errors_notice</p>
            <ul>
              <li v-for="error in validationErrors" :key="error">{{ error }}</li>
            </ul>
          </div>
        </v-notice>

        <div class="field">
          <div class="type-label">Type</div>
          <v-select v-model="modelValues.type" :items="linkTypes"></v-select>
        </div>
        <div class="field">
          <div class="type-label">{{ hrefLabel }}</div>
          <v-input v-model="modelValues.href" :placeholder="linkPlaceholder"></v-input>
        </div>
        <div class="field">
          <div class="type-label">Open link in</div>
          <v-checkbox
            v-model="modelValues.newTab"
            label="New tab"
            :disabled="disableTarget"
            block
          ></v-checkbox>
        </div>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-button secondary @click="$emit('closeDialog')">Cancel</v-button>
      <v-button :disabled="oldLinkIsEmpty" danger @click="onRemove">Remove</v-button>
      <v-button :disabled="linkIsEmpty" @click="onAdd">Save</v-button>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import isEmail from "validator/lib/isEmail";
import isSlug from "validator/lib/isSlug";
import isURL from "validator/lib/isURL";
import { ref, computed, watchEffect } from "vue";

import { type LinkAttributes } from "../../common/types/tools";

// Props
interface Props {
  get: () => LinkAttributes;
}
const props = defineProps<Props>();

// Types of links
type LinkType = {
  text: string;
  value: string | null;
  prefix: string[];
  hidePrefix?: boolean;
  placeholder?: string | boolean;
  noTarget?: boolean;
  newTabDefault?: boolean;
};
const linkTypes: LinkType[] = [
  {
    text: "External link",
    value: "external_link",
    prefix: ["http://", "https://"],
    placeholder: "https://",
    newTabDefault: true,
  },
  {
    text: "Internal link",
    value: "internal_link",
    prefix: ["/"],
    placeholder: "/",
    newTabDefault: false,
  },
  {
    text: "Email",
    value: "email",
    prefix: ["mailto:"],
    hidePrefix: true,
    placeholder: "mail@example.com",
    noTarget: true,
  },
  {
    text: "Phone number",
    value: "tel",
    prefix: ["tel:"],
    hidePrefix: true,
    placeholder: "+1234567890",
    noTarget: true,
  },
  { text: "Other", value: null, prefix: [] },
];

// Display old values
const getDisplayValues = (old: LinkAttributes) => {
  let type = old.href ? null : "external_link";
  let href = old.href ? old.href : "";
  let newTab: boolean | null = null;

  if (Object.hasOwn(old, "target")) {
    newTab = old.target === null ? false : true;
  }

  linkTypes.forEach((linkType) => {
    linkType.prefix.forEach((prefix) => {
      if (href.startsWith(prefix)) {
        type = linkType.value;

        if (linkType.noTarget) newTab = null;

        if (linkType.hidePrefix) href = href.replace(new RegExp(`^${prefix}`, "g"), "");

        return;
      }
    });
  });

  return { type, href, newTab };
};
const oldValues = props.get();
const modelValues = ref(getDisplayValues(oldValues));

// Prepare values for inserting
const getSaveableValues = () => {
  const { type, newTab } = modelValues.value;
  let href = modelValues.value.href;

  let target = newTab ? "_blank" : null;

  if (newTab) target = "_blank";

  linkTypes.forEach((linkType) => {
    if (linkType.value !== type) return;

    if (newTab === null && linkType.newTabDefault) target = "_blank";

    linkType.prefix.forEach((prefix) => {
      if (linkType.hidePrefix) {
        href = prefix + href;
        return;
      }
    });
  });

  return { href, target };
};

// Error
const validationErrors = ref<string[]>([]);
const validateInput = () => {
  const { type, href } = modelValues.value;

  validationErrors.value = [];

  const externalLinkOptions = {
    require_protocol: true,
    protocols: ["http", "https"],
    validate_length: false,
  };

  if (type === "external_link") {
    const protocolExists = linkTypes
      .find(({ value }) => value === type)
      ?.prefix.some((prefix) => href.startsWith(prefix));

    if (!protocolExists) {
      validationErrors.value.push("Link must start with http:// or https://");
    }

    if (!isURL(href, externalLinkOptions)) {
      validationErrors.value.push("Invalid link format");
    }
  }

  if (type === "internal_link") {
    if (!href.startsWith("/")) {
      validationErrors.value.push("Link must start with a /");
    }

    if (!isSlug(href)) {
      validationErrors.value.push("Invalid link format");
    }
  }

  if (type === "email" && !isEmail(href)) {
    validationErrors.value.push("Invalid e-mail format");
  }

  const regexPhoneNumber = /^[+]?[\d\s]+$/;

  if (type === "tel" && !regexPhoneNumber.test(href)) {
    validationErrors.value.push("Invalid phone number: use only numbers & spaces");
  }
};

// Href label
const hrefLabel = computed(() => {
  if (modelValues.value.type === "external_link") return "External link";

  if (modelValues.value.type === "internal_link") return "Internal link";

  if (modelValues.value.type === "email") return "Email";

  if (modelValues.value.type === "tel") return "Phone number";

  return "URL";
});

// Placeholder
const linkPlaceholder = computed(() => {
  const linkType = linkTypes.find(({ value }) => value === modelValues.value.type);

  if (linkType?.placeholder) return linkType.placeholder;

  return false;
});

// When changing type and if noTarget is set, set newTab to null
watchEffect(() => {
  const linkType = linkTypes.find(({ value }) => value === modelValues.value.type);

  if (linkType?.noTarget) modelValues.value.newTab = null;
});

// disableTarget if noTarget is set
const disableTarget = computed(() => {
  const linkType = linkTypes.find(({ value }) => value === modelValues.value.type);

  if (linkType?.noTarget) return true;

  return false;
});

// Disable buttons if href is empty
const linkIsEmpty = computed(
  () => modelValues.value.href === "" || modelValues.value.href === null,
);
const oldLinkIsEmpty = computed(() => !oldValues.hasOwnProperty("href"));

// Actions
const emit = defineEmits(["get", "set", "unset", "closeDialog"]);
const onRemove = () => {
  emit("unset");
  emit("closeDialog");
};
const onAdd = () => {
  validateInput();

  if (validationErrors.value.length) return;

  emit("set", getSaveableValues());
  emit("closeDialog");
};
</script>

<style scoped>
.card {
  --form-vertical-gap: 40px;
}

/* Relevant parts of the following styles are based on 'src/interfaces/input-rich-text-html/input-rich-text-html.vue' (Directus repository) */
.card {
  overflow: auto;
}

.card-title {
  margin-bottom: 24px;
  font-size: 24px;
}

/* Relevant parts of the following styles are based on '@/styles/mixins/form-grid' (Directus repository) */
.grid {
  display: grid;
  grid-template-columns: [start] minmax(0, 1fr) [half] minmax(0, 1fr) [full];
  gap: var(--theme--form--row-gap, var(--form-vertical-gap))
    var(--theme--form--column-gap, var(--form-horizontal-gap));
}

.grid .type-label {
  margin-bottom: 8px;
}

.grid .field {
  grid-column: start / fill;

  @media (min-width: 960px) {
    grid-column: start / full;
  }
}
</style>
