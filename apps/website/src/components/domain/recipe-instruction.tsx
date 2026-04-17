import { useEffect, useRef } from "react";
import type { InlineIngredient, InlineIngredientHTMLElement } from "@wizard/content";

import { formatIngredientAmount } from "@/lib/formatting";

type RecipeInstructionProps = {
  content: string;
  servings: number;
  baseServings: number;
};

const parseInlineIngredient = (
  element: InlineIngredientHTMLElement,
): InlineIngredient | undefined => {
  try {
    return JSON.parse(element.dataset.ingredient) as InlineIngredient;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

const formatInlineIngredient = (
  ingredient: InlineIngredient,
  servings: number,
  baseServings: number,
) => {
  if (ingredient.amount === undefined) {
    return undefined;
  }

  const scaledAmount = (ingredient.amount * servings) / baseServings;
  const useSingular = scaledAmount <= 1;
  const amountLabel = formatIngredientAmount(scaledAmount);
  const unitLabel = ingredient.unit
    ? useSingular
      ? ingredient.unit.singular
      : ingredient.unit.plural
    : "";
  const nameLabel = useSingular ? ingredient.name.singular : ingredient.name.plural;

  return [amountLabel, unitLabel, nameLabel].filter(Boolean).join(" ");
};

export const RecipeInstruction = (props: Readonly<RecipeInstructionProps>) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const inlineIngredients =
      container.querySelectorAll<InlineIngredientHTMLElement>(".inline-ingredient");
    inlineIngredients.forEach((element) => {
      const ingredient = parseInlineIngredient(element);
      if (!ingredient) {
        return;
      }

      const formatted = formatInlineIngredient(ingredient, props.servings, props.baseServings);
      if (!formatted) {
        return;
      }

      element.textContent = formatted;
    });
  }, [props.baseServings, props.servings, props.content]);

  return (
    <div
      ref={containerRef}
      className="pt-1 text-lg leading-relaxed text-[color:var(--color-muted)]"
      dangerouslySetInnerHTML={{ __html: props.content }}
    />
  );
};
