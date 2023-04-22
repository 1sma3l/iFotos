import authRouter from "../modules/auth/router/routes";
import homeRouter from "../modules/home/router/routes";
import isAuthenticatedGuard from "../modules/home/router/auth-guard";
const routes = [
  {
    path: "/",
    redirect: "/auth",
  },
  {
    path: "/auth",

    ...authRouter,
  },
  {
    path: "/home",
    beforeEnter: [isAuthenticatedGuard],
    ...homeRouter,
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
