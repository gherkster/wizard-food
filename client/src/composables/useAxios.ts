// Add XML header so that backend returns 401 http error after making unauthorized request instead of login page redirect
import axios from "axios";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/userStore";

axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.interceptors.response.use(
  function (response) {
    // If the API indicates that the user is currently authenticated,
    // then set the value in the store and reset the last update time
    // so that we know how long until an authenticated user times out
    if (response.headers.authenticated) {
      const userStore = useUserStore();
      userStore.wasAuthenticatedAtLastCheck = response.headers.authenticated === "true";
      userStore.resetLastUpdateTime();
    }
    return response;
  },
  function (error) {
    if (error.response.status === 401) {
      const router = useRouter();
      router.push("/login");
    }
    return Promise.reject(error);
  }
);

export function useAxios() {
  return axios;
}
