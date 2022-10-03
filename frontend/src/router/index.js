import { createRouter, createWebHistory } from "vue-router";

import Home from "@/views/Home.vue";
import Recipe from "@/views/Recipe.vue";
import Search from "@/views/Search.vue";
import Editor from "@/views/Editor.vue";

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

const router = createRouter({
  history: createWebHistory(),
  base: import.meta.env.BASE_URL,
  routes,
});

export default router;
