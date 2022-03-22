<template>
  <div class="app-alerts">
    <transition-group name="alert">
      <timed-alert
        v-for="(alert, index) in alerts"
        :key="alert.key"
        :severity="alert.severity"
        :message="alert.message"
        @removeAlert="removeAlert(index)"
      />
    </transition-group>
  </div>
</template>

<script>
import TimedAlert from "@/components/TimedAlert";
import { uuid } from "vue-uuid/index.mjs";
import { eventBus } from "@/main";
import { AlertKeys } from "@/constants/enums";
export default {
  name: "AlertSection",
  components: { TimedAlert },
  data: () => ({
    alerts: [],
  }),
  created() {
    eventBus.$on(AlertKeys.ADD, (severity, message) => {
      this.alerts.push({
        key: uuid.v1(),
        severity: severity,
        message: message,
      });
    });
  },
  methods: {
    removeAlert(index) {
      this.alerts.splice(index, 1);
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
.alert-move,
.alert-leave-active {
  transition: opacity 0.5s ease;
}
.alert-leave-to {
  opacity: 0;
}
</style>
