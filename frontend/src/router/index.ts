import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import Home from "@/views/Home.vue";
import Recipe from "@/views/Recipe.vue";
import Search from "@/views/Search.vue";
import Editor from "@/views/Editor.vue";

const routes: Array<RouteRecordRaw> = [
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

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APIURL),
  routes,
});

export default router;
