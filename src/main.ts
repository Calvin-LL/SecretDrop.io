import "./registerServiceWorker";

import Vue from "vue";
import AsyncComputed from "vue-async-computed";

import App from "./App.vue";
import router from "./router";

Vue.use(AsyncComputed);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
