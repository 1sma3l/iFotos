export default {
  name: "auth",
  component: () => import("../layouts/AuthLayout.vue"),
  children: [
    {
      path: "",
      name: "LoginPage",
      component: () => import("../views/LoginPage.vue"),
    },
    {
      path: "/reset",
      name: "ResetPwd",
      component: () => import("../views/ResetPwd.vue"),
    },
  ],
};
