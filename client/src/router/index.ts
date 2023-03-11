import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const Home = () => import("@/views/Home.vue");
const Recipe = () => import("@/views/recipe/Recipe.vue");
const Search = () => import("@/views/Search.vue");
const Editor = () => import("@/views/editor/Editor.vue");
const RecipeList = () => import("@/views/RecipeList.vue");
const Login = () => import("@/views/Login.vue");

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
    path: "/admin",
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
