const baseUrl = import.meta.env.VITE_APIURL ?? "";

const apis = {
  recipes: baseUrl + "/api/recipes/",
  recipeSlugs: baseUrl + "/api/recipes/slugs",
  dropdownOptions: baseUrl + "/api/recipes/editor/dropdown-options",
  login: baseUrl + "/api/auth/login",
  logout: baseUrl + "/api/auth/logout",
};

export default apis;
