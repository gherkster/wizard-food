<template>
  <Suspense @fallback="startLoadingBar" @resolve="stopLoadingBar">
    <router-view />
  </Suspense>
</template>

<script setup lang="ts">
import { useLoadingBar } from "naive-ui";

const loadingBar = useLoadingBar();

function startLoadingBar() {
  loadingBar.start();
}

function stopLoadingBar() {
  loadingBar.finish();
}
</script>
