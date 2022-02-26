import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "GenerateKeyPair",
    component: () => import("@/views/GenerateKeyPairView.vue"),
    meta: {
      title: "SecretDrop.io - Generate New Key Pair",
      metaTags: [
        // TODO: add description
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
    component: () => import("@/views/EncryptView.vue"),
    meta: {
      title: "Decrypt",
      metaTags: [
        // TODO: add description
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
    component: () => import("@/views/EncryptView.vue"),
    meta: {
      title: "Encrypt",
      metaTags: [
        // TODO: add description
        {
          name: "robots",
          content: "noindex",
        },
      ],
    },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    } else if (savedPosition) {
      return savedPosition;
    } else {
      return {
        top: 0,
      };
    }
  },
});

router.afterEach((to) => {
  document.title = to.meta?.title as string;

  // we add data-vue-router-controlled attribute to each meta tag
  // so we can use it later to remove meta tags from head
  document
    .querySelectorAll("[data-vue-router-controlled]")
    .forEach((el) => el.parentNode?.removeChild(el));

  if (to.meta?.metaTags) {
    (to.meta.metaTags as Record<string, string>[]).forEach((tagDef) => {
      const tag = document.createElement("meta");

      Object.keys(tagDef).forEach((key) => {
        tag.setAttribute(key, tagDef[key]);
      });

      tag.setAttribute("data-vue-router-controlled", "");

      document.head.appendChild(tag);
    });
  }
});
