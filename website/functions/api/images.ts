export const onRequest: PagesFunction = async () => {
  return new Response(new Date().toISOString());
};
