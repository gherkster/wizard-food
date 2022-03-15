import Vue from "vue";
import VueRouter from "vue-router";
import RecipeList from "@/views/RecipeList";
import RecipeEditor from "@/views/RecipeEditor";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Recipes",
    component: RecipeList,
  },
  {
    path: "/editor",
    name: "Editor",
    component: RecipeEditor,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
