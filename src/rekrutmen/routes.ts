import type { RouteRecordRaw } from "vue-router";


const rekrutmenRoutes: RouteRecordRaw[] = [

  {
    path: "/user",

    component: () => 
      import("./layouts/UserLayout.vue"),


    children: [

      {
        path: "",
        redirect: "/user/dashboard",
      },


      // DASHBOARD
      {
        path: "dashboard",
        name: "user-dashboard",
        component: () =>
          import("./pages/Dashboard.vue"),
      },


      // LOWONGAN
      {
        path: "lowongan",
        name: "user-lowongan",
        component: () =>
          import("./pages/Lowongan.vue"),
      },


      // LAMARAN
      {
        path: "lamaran",
        name: "user-lamaran",
        component: () =>
          import("./pages/LamaranSaya.vue"),
      },


      {
        path: "lamaran/:id",
        name: "detail-lamaran",
        component: () =>
          import("./pages/DetailLamaran.vue"),
      },


      // PESAN
      {
        path: "pesan",
        name: "user-pesan",
        component: () =>
          import("./pages/Messages.vue"),
      },


      // =========================
      // TEST KANDIDAT
      // =========================

      


      {
        path: "test/:attemptId/kerjakan",

        name: "kerjakan-test",

        component: () =>
          import("./pages/KerjakanTest.vue"),

        props: true,
      },


      {
        path: "test/:attemptId/result",

        name: "test-result",

        component: () =>
          import("./pages/TestResult.vue"),

        props: true,
      },


      // PROFILE
      {
        path: "profile",
        name: "user-profile",
        component: () =>
          import("./pages/Profile.vue"),
      },


      // PENGATURAN
      {
        path: "pengaturan",
        name: "user-pengaturan",
        component: () =>
          import("./pages/Pengaturan.vue"),
      },

    ],
  },

];


export default rekrutmenRoutes;