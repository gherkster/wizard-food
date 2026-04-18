import { loadPagesContent } from "@wizard/content";

export default defineEventHandler(async () => {
  const content = await loadPagesContent(".content");
  return content.recipes;
});
