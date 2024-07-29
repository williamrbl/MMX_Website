const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("src/pages/HomePage.vue") },
      { path: "/photos", component: () => import("src/pages/PhotoPage.vue") },
      {
        path: "/locations",
        component: () => import("src/pages/LocationPage.vue"),
      },
      { path: "/devis", component: () => import("src/pages/DevisPage.vue") },
      {
        path: "/arena2024",
        component: () => import("src/pages/articles/ArenaDeux.vue"),
      },
      {
        path: "/displayparameters",
        component: () => import("src/pages/DisplayParameters.vue"),
      },
      {
        path: "/parameters",
        component: () => import("src/pages/Connexion.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
