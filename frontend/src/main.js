import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import pinia from "./plugins/pinia";
import vuetify from "./plugins/vuetify";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCheck, faArrowRotateRight, faStar as fasStar, faXmark, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";

library.add(faCheck, faArrowRotateRight, fasStar, farStar, faXmark, faSpinner);
Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  router,
  pinia,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
