<template>
  <div class="app-alerts">
    <transition-group name="alert">
      <timed-alert
        v-for="alert in alertStore.alerts"
        :key="alert.id"
        :severity="alert.severity"
        :message="alert.message"
        @expired="removeAlert(alert.id)"
      />
    </transition-group>
  </div>
</template>

<script>
import TimedAlert from "@/components/atoms/TimedAlert";
import { useAlertStore } from "@/store/alertStore";

export default {
  name: "AlertSection",
  components: { TimedAlert },
  setup() {
    const alertStore = useAlertStore();
    return { alertStore };
  },
  methods: {
    removeAlert(id) {
      this.alertStore.removeAlert(id);
    },
  },
};
</script>
