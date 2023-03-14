<template>
  <n-form-item :label="label">
    <n-upload :max="1" directory-dnd @change="onFileSelect">
      <n-upload-dragger>
        <x-icon fa-icon="fa-cloud-arrow-up" size="2x" />
        <p>{{ description }}</p>
      </n-upload-dragger>
    </n-upload>
  </n-form-item>
</template>

<script setup lang="ts">
import { NUpload, NUploadDragger, NFormItem, UploadFileInfo } from "naive-ui";
import { XIcon } from "@/components";

const props = defineProps<{
  value: string;
  type: string;
  description: string;
}>();

const emit = defineEmits<{
  (e: "change", value: Array<File>): void;
}>();
function onFileSelect(data: { fileList: Array<UploadFileInfo> }) {
  const files = data.fileList.filter((f) => !!f.file).map((f) => f.file as File);
  emit("change", files);
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>