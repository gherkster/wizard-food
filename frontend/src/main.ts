import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";

import { fontAwesomeIconsPlugin } from "./plugins";
const app = createApp(App);

app.use(router);

app.use(createPinia());
app.use(fontAwesomeIconsPlugin);

app.mount("#app");
