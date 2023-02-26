import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import Home from "@/views/Home.vue";
import Recipe from "@/views/Recipe.vue";
import Search from "@/views/Search.vue";
import Editor from "@/views/editor/Editor.vue";
import RecipeList from "@/views/RecipeList.vue";
import Login from "@/views/Login.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/search",
    name: "search",
    component: Search,
  },
  {
    path: "/recipes",
    name: "recipes",
    component: RecipeList,
  },
  {
    path: "/recipes/:slug",
    name: "recipe",
    component: Recipe,
  },
  {
    path: "/recipes/:slug/edit",
    component: Editor,
  },
  {
    path: "/new",
    name: "new-recipe",
    component: Editor,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  // TODO: 404 catch all handler
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
