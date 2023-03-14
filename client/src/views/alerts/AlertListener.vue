<template>
  <div class="app-alerts">
    <transition-group name="alert">
      <timed-alert v-for="alert in alertStore.alerts" :key="alert.message" :severity="alert.severity" :message="alert.message" />
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import TimedAlert from "@/components/TimedAlert.vue";
import { useAlertStore } from "@/store/alertStore";

const alertStore = useAlertStore();
</script>
