import { createApp } from "vue";
import smoothscroll from "smoothscroll-polyfill";

import { router } from "./router";
import App from "./App.vue";

smoothscroll.polyfill();

createApp(App).use(router).mount("#app");
