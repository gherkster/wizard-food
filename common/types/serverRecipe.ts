export interface ServerRecipe {
  title: string;
  note?: string;
  coverImage?: ServerImage;
  category: string;
  cuisine: string;
  slug: string;
  preparationDuration?: number;
  cookingDuration?: number;
  customDurationName?: string;
  customDuration?: number;
  servings?: number;
  ingredientGroups: ServerIngredientGroup[];
  instructionGroups: ServerInstructionGroup[];
  tags: ServerTag[];
  status: "published" | "draft";
  date_created: Date;
}

interface ServerIngredientGroup {
  name?: string;
  ingredients: ServerIngredient[];
}

export interface ServerIngredient {
  id: number;
  unit?: string;
  name: string;
  note?: string;
  amount?: number;
}

interface ServerInstructionGroup {
  name?: string;
  instructions: ServerInstruction[];
}

interface ServerInstruction {
  text: string;
  image?: ServerImage;
}

interface ServerTag {
  tags_id: ServerTagsId;
}

interface ServerTagsId {
  value: string;
}

interface ServerImage {
  id: string;
  title: string;
  height: number;
  width: number;
  modified_on: string;
}
