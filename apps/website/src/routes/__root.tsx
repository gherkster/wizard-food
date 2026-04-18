import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { SiteLayout } from "@/components/layout/site-layout";

import appCss from "@/styles/app.css?url";

const RootDocument = (props: Readonly<{ children: ReactNode }>) => {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {props.children}
        <Scripts />
      </body>
    </html>
  );
};

const RootComponent = () => {
  return (
    <RootDocument>
      <SiteLayout>
        <Outlet />
      </SiteLayout>
    </RootDocument>
  );
};

export const Route = createRootRoute({
  head: () => ({
    links: [{ rel: "stylesheet", href: appCss }],
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      { title: "Wizard Food" },
      {
        name: "description",
        content: "Wizard Food recipes and search experience.",
      },
    ],
  }),
  component: RootComponent,
  errorComponent: ({ error }) => (
    <RootDocument>
      <div style={{ padding: "2rem", color: "red" }}>
        <h1>Something went wrong</h1>
        <pre>{error.message}</pre>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    </RootDocument>
  ),
  notFoundComponent: () => (
    <RootDocument>
      <div style={{ padding: "2rem" }}>
        <h1>404 - Page Not Found</h1>
        <p>We couldn't find the recipe you're looking for.</p>
      </div>
    </RootDocument>
  ),
});
