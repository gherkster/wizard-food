import { defineStore } from "pinia";
import { Severity } from "@/constants/enums";
import { uuid } from "vue-uuid/index.mjs";

export const useAlertStore = defineStore("alert", {
  state: () => ({
    alerts: [],
  }),
  actions: {
    showSuccessAlert(message, timeoutMs = 4000) {
      this._createAlert(Severity.SUCCESS, message, timeoutMs);
    },
    showInfoAlert(message) {
      this._createAlert(Severity.INFO, message);
    },
    showWarningAlert(message) {
      this._createAlert(Severity.WARNING, message);
    },
    showErrorAlert(message) {
      this._createAlert(Severity.ERROR, message);
    },
    _createAlert(severity, message) {
      this.alerts.push({
        id: uuid.v1(),
        severity: severity,
        message: message,
      });
    },
    removeAlert(alertId) {
      this.alerts = this.alerts.filter((alert) => alert.id !== alertId);
    },
  },
});
