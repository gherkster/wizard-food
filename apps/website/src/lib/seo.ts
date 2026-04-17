export const secondsToIsoDuration = (seconds: number) => {
  const totalSeconds = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  return `PT${hours > 0 ? `${hours}H` : ""}${minutes > 0 ? `${minutes}M` : ""}${secs > 0 || (hours === 0 && minutes === 0) ? `${secs}S` : ""}`;
};

export const recipeTotalDurationSeconds = (recipe: {
  preparationDuration?: number;
  cookingDuration?: number;
  customDuration?: number;
}) => {
  return (
    (recipe.preparationDuration ?? 0) + (recipe.cookingDuration ?? 0) + (recipe.customDuration ?? 0)
  );
};
