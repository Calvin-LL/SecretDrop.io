import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: () =>
      import(/* webpackChunkName: "home" */ "../views/GenerateKeyPair.vue"),
    meta: {
      title: "SecretDrop.io - Generate New Key Pair",
      metaTags: [
        {
          name: "robots",
          content: "index, follow",
        },
      ],
    },
  },
  {
    path: "/decrypt",
    name: "Decrypt",
    component: () =>
      import(/* webpackChunkName: "decrypt" */ "../views/Decrypt.vue"),
    meta: {
      title: "Decrypt",
      metaTags: [
        {
          name: "robots",
          content: "noindex",
        },
      ],
    },
  },
  {
    path: "/encrypt",
    name: "Encrypt",
    component: () =>
      import(/* webpackChunkName: "encrypt" */ "../views/Encrypt.vue"),
    meta: {
      title: "Encrypt",
      metaTags: [
        {
          name: "robots",
          content: "noindex",
        },
      ],
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
