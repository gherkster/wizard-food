import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import pinia from "./plugins/pinia";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

export const eventBus = new Vue();

new Vue({
  router,
  pinia,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
