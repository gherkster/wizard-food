export const throwExpression = (errorMessage: string): never => {
  throw new Error(errorMessage);
};
