<template>
  <n-upload directory-dnd @change="handleUpload">
    <n-upload-dragger />
  </n-upload>
</template>

<script>
import { NUpload, NUploadDragger } from "naive-ui";

export default {
  name: "XUpload",
  inheritAttrs: false,
  components: {
    NUpload,
    NUploadDragger,
  },
  props: {
    value: {
      type: String,
      required: true,
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
