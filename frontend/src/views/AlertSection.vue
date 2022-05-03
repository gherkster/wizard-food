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

<style scoped>
.app-alerts {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 30%; /* TODO: Update for mobile */
}
.alert-enter {
  transform: translateY(30px);
}
.alert-move,
.alert-enter-active,
.alert-leave-active {
  transition: all 0.5s ease;
}
.alert-leave-to {
  opacity: 0;
}
.alert-leave-active {
  position: absolute;
}
</style>
