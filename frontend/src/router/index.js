import Vue from "vue";
import VueRouter from "vue-router";

import Home from "@/views/Home";
import Recipe from "@/views/Recipe";
import Search from "@/views/Search";
import Editor from "@/views/Editor";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/recipes",
    component: Search,
  },
  {
    path: "/recipes/:slug",
    component: Recipe,
  },
  {
    path: "/editor",
    component: Editor,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
