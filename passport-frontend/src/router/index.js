import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/events",
    name: "events",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/EventView.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import("../views/LoginView.vue"),
  },
  {
    path: "/create",
    name: "create",
    component: () =>
      import("../views/CreateView.vue"),
  },
  {
    path: "/delete",
    name: "delete",
    component: () =>
      import("../views/DeleteView.vue"),
  },
  {
    path: "/details",
    name: "details",
    component: () =>
      import("../views/DetailsView.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () =>
      import("../views/RegisterView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
