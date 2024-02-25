/*
Provide autocomplete functionality for fields within the CMS. Point the autocomplete field to the deployed extension
location and the function will provide autocomplete results for the /field path.

Results are provided as a list of objects with the key equalling the entered path, and the value being the autocomplete
value.
 */
import { createError } from "@directus/errors";

const MyExtensionError = createError("UNEXPECTED_ERROR", "Something went wrong...", 500);

export default (router, { services }) => {
  const { ItemsService } = services;

  router.get("/:field", (req, res, next) => {
    const recipeService = new ItemsService("recipes", { schema: req.schema, accountability: req.accountability });
    const field = req.params.field;

    recipeService
      .readByQuery({
        sort: [field],
        fields: [field],
        filter: {
          [field]: {
            _contains: req.query.q,
          },
          status: {
            _eq: "published",
          },
        },
      })
      .then((results) => {
        return res.json(results.filter((r) => !!r[field]));
      })
      .catch((error) => {
        return next(new MyExtensionError());
      });
  });
};
