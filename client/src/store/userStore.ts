import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useUserStore = defineStore(
  "user",
  () => {
    const wasAuthenticatedAtLastCheck = ref(false);
    const lastUpdateTime = ref(new Date(0));
    const milliSecondsSinceLastAuthCheck = ref(Number.MAX_VALUE);

    let authCheckerIntervalId: NodeJS.Timer;
    function setUserToLoggedIn() {
      if (authCheckerIntervalId) {
        clearInterval(authCheckerIntervalId);
      }

      // Only start checking whether the user is authenticated so that unauthenticated users (vast majority) are not checking needlessly
      authCheckerIntervalId = setInterval(() => {
        // Recalculate the milliseconds since the last API call
        // which confirmed whether the user was authenticated or unauthenticated
        milliSecondsSinceLastAuthCheck.value = Math.abs(new Date().getTime() - lastUpdateTime.value.getTime());
        // Stop checking once the user has timed out since this won't change until logging back in again
        if (!isAuthenticated.value) {
          clearInterval(authCheckerIntervalId);
        }
      }, 5000);
    }

    function resetLastUpdateTime() {
      lastUpdateTime.value = new Date();
      milliSecondsSinceLastAuthCheck.value = 0;
    }

    const isAuthenticated = computed(() => {
      // Check on wasAuthenticatedAtLastCheck first, since vue will just reuse the cached computed result
      // if the user is not authenticated instead of constantly recalculating whether the user is still authenticated

      // Authenticated sessions time out after 30 minutes
      return wasAuthenticatedAtLastCheck.value && milliSecondsSinceLastAuthCheck.value / 60000 < 30;
    });

    return {
      isAuthenticated,
      wasAuthenticatedAtLastCheck,
      milliSecondsSinceLastAuthCheck,
      lastUpdateTime,
      resetLastUpdateTime,
      setUserToLoggedIn,
    };
  },
  {
    persist: {
      debug: true,
      afterRestore: (context) => {
        // Ensure that Date type is rehydrated as a Date, not a string
        context.store.lastUpdateTime = new Date(context.store.lastUpdateTime);
      },
    },
  }
);
