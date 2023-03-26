import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useUserStore } from "@/store";

const Home = () => import("@/views/home/Home.vue");
const Recipe = () => import("@/views/recipe/Recipe.vue");
const Editor = () => import("@/views/editor/Editor.vue");
const RecipeList = () => import("@/views/recipe-list/RecipeList.vue");
const Login = () => import("@/views/login/Login.vue");

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: Home,
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
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/new",
    name: "new-recipe",
    component: Editor,
    meta: {
      requiresAuth: true,
    },
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

router.beforeResolve((to) => {
  const userStore = useUserStore();
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    return {
      path: "/admin",
      query: {
        redirect: to.fullPath,
      },
    };
  }
});

export default router;
