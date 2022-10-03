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
} from "@fortawesome/free-solid-svg-icons";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";

library.add(faCheck, faArrowRotateRight, fasStar, farStar, faXmark, faSpinner, faPlus, faMinus, faChevronDown);

const pinia = createPinia();

createApp(App)
  .use(router)
  .use(pinia)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
