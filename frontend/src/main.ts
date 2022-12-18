import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCheck,
  faArrowRotateRight,
  faStar as fasStar,
  faXmark,
  faSpinner,
  faPlus,
  faMinus,
  faChevronDown,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";
import axios from "./api/axios";

library.add(faCheck, faArrowRotateRight, fasStar, farStar, faXmark, faSpinner, faPlus, faMinus, faChevronDown, faUser);

const app = createApp(App);

app.use(router);

const pinia = createPinia();
app.use(pinia);

app.component("font-awesome-icon", FontAwesomeIcon);

app.config.globalProperties.$axios = axios;

app.mount("#app");
