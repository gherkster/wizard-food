import type { Ingredient } from "@wizard/content";

import { formatIngredientAmount } from "@/lib/formatting";

type RecipeIngredientProps = {
  ingredient: Ingredient;
  servings: number;
  baseServings: number;
};

export const RecipeIngredient = (props: Readonly<RecipeIngredientProps>) => {
  const amount = props.ingredient.amount;
  const scaledAmount =
    amount !== undefined ? (amount * props.servings) / props.baseServings : undefined;

  const amountLabel = scaledAmount !== undefined ? formatIngredientAmount(scaledAmount) : "";
  const useSingular = scaledAmount !== undefined ? scaledAmount <= 1 : false;

  const unitLabel = props.ingredient.unit
    ? useSingular
      ? props.ingredient.unit.singular
      : props.ingredient.unit.plural
    : "";

  const nameLabel = useSingular ? props.ingredient.name.singular : props.ingredient.name.plural;

  return (
    <span>
      {amountLabel ? `${amountLabel} ` : ""}
      {unitLabel ? `${unitLabel} ` : ""}
      <span className="recipe-ingredient-name" dangerouslySetInnerHTML={{ __html: nameLabel }} />
      {props.ingredient.note ? (
        <i className="text-[color:var(--color-muted)]"> {props.ingredient.note}</i>
      ) : null}
    </span>
  );
};
