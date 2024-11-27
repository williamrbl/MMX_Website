const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("src/pages/HomePage.vue") },
      { path: "photos", component: () => import("src/pages/PhotoPage.vue") },
      {
        path: "locations",
        component: () => import("src/pages/LocationPage.vue"),
      },
      { path: "studio", component: () => import("src/pages/StudioPage.vue") },
      {
        path: "prestations",
        component: () => import("src/pages/PrestationsPage.vue"),
      },
      {
        path: "prestations/customize",
        component: () =>
          import("src/components/Prestations/CustomPrestationsPage.vue"),
      },
      {
        path: "bureau",
        component: () => import("src/pages/GestionBureau.vue"),
      },
      {
        path: "photos/:collectionName",
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
