import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { Quasar } from "quasar";
import "@quasar/extras/material-icons/material-icons.css";
import "./assets/reset.css";
import "quasar/src/css/index.sass";
import App from "./App.vue";
import router from "./router/index.ts";

createApp(App)
  .use(router)
  .use(createPinia().use(piniaPluginPersistedstate))
  .use(Quasar, {
    plugins: {}, // import Quasar plugins and add here
  })
  .mount("#app");
