import { defineStore } from "pinia";
import { Severity } from "@/constants/enums";
import { ref } from "vue";
import { Alert } from "@/types/alert";

export const useAlertStore = defineStore("alert", () => {
  const alerts = ref<Array<Alert>>([]);
  const defaultTimeoutMs = 4000;

  function showSuccessAlert(message: string, timeoutMs = defaultTimeoutMs) {
    _createAlert(Severity.SUCCESS, message, timeoutMs);
  }
  function showInfoAlert(message: string, timeoutMs = defaultTimeoutMs) {
    _createAlert(Severity.INFO, message, timeoutMs);
  }
  function showWarningAlert(message: string, timeoutMs = defaultTimeoutMs) {
    _createAlert(Severity.WARNING, message, timeoutMs);
  }
  function showErrorAlert(message: string, timeoutMs = defaultTimeoutMs) {
    _createAlert(Severity.ERROR, message, timeoutMs);
  }
  function _createAlert(severity: Severity, message: string, timeoutMs: number) {
    const alert = {
      severity: severity,
      message: message,
    };
    alerts.value.push(alert);
    setTimeout(() => {
      alerts.value = alerts.value.splice(alerts.value.indexOf(alert));
    }, timeoutMs);
  }

  return {
    alerts,
    showSuccessAlert,
    showInfoAlert,
    showWarningAlert,
    showErrorAlert,
  };
});
