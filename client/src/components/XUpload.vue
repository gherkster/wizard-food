<template>
  <n-form-item :label="label">
    <n-upload directory-dnd @change="handleUpload">
      <n-upload-dragger>
        <x-icon fa-icon="fa-cloud-arrow-up" size="2x" />
        <p>{{ description }}</p>
      </n-upload-dragger>
    </n-upload>
  </n-form-item>
</template>

<script>
import { NUpload, NUploadDragger, NFormItem } from "naive-ui";
import { XIcon } from "@/components";

export default {
  name: "XUpload",
  inheritAttrs: false,
  components: {
    NFormItem,
    NUpload,
    NUploadDragger,
    XIcon,
  },
  props: {
    value: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: false,
      default: "",
    },
    description: {
      type: String,
      required: false,
      default: "Upload here",
    },
    path: {
      type: String,
      required: true,
    },
  },
  methods: {
    handleUpload(data) {
      // TODO: Implement emit uploaded image details
      console.log(data);
    },
  },
};
</script>
