import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/influencers",
    name: "Influencers",
    component: () => import("../views/Influencers.vue"),
  },
  {
    path: "/schedule/:id",
    name: "Schedule",
    component: () => import("../views/Schedule.vue"),
  },
  {
    path: "/schedule-form",
    name: "ScheduleForm",
    component: () => import("../views/ScheduleForm.vue"),
    props: true,
  },
  {
    path: "/confirmation",
    name: "Confirmation",
    component: () => import("../views/Confirmation.vue"),
    props: true,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
