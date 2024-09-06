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
      { path: "/studio", component: () => import("src/pages/StudioPage.vue") },

      { path: "/devis", component: () => import("src/pages/DevisPage.vue") },
      {
        path: "/parameters",
        component: () => import("src/pages/Parameters.vue"),
      },
      {
        path: "/photos/:collectionName",
        component: () => import("src/components/Photos/DisplayPhotos.vue"),
        props: true,
      },
    ],
  },

  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
