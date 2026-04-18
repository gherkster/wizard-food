import { createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  return createRouter({
    defaultErrorComponent: (error) => <div>{error.error.message}</div>,
    defaultNotFoundComponent: (error) => <div>{error.routeId}</div>,
    routeTree,
    scrollRestoration: true,
  });
};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
