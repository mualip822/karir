import type { RouteRecordRaw } from "vue-router";

const authRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    component: () => import("./pages/Login.vue"),
  },
];

export default authRoutes;