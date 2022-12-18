// Add XML header so that backend returns 401 http error after making unauthorized request instead of login page redirect
import axios from "axios";
import router from "../router/index";

axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response.status === 401) {
      router.push("/login");
    }
    return Promise.reject(error);
  }
);

export default axios;
