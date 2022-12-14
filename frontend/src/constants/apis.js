const baseUrl = import.meta.env.VITE_APIURL;

const apis = {
  recipes: baseUrl + "/api/recipes/",
  recipeSlugs: baseUrl + "/api/recipes/slugs",
  dropdownOptions: baseUrl + "/api/recipes/editor/dropdown-options",
};

export default apis;
