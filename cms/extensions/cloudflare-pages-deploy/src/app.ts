import { defineOperationApp } from "@directus/extensions-sdk";

export default defineOperationApp({
  id: "cloudflare-pages-deploy",
  name: "Deploy cloudflare pages",
  icon: "rocket_launch",
  description: "Deploy a cloudflare pages instance",
  overview: ({ cloudflareProjectName }) => [
    {
      label: "Project name",
      text: cloudflareProjectName,
    },
  ],
  options: [
    {
      field: "cloudflareAccountId",
      name: "Cloudflare Pages account ID",
      type: "string",
      meta: {
        width: "full",
        interface: "input",
      },
    },
    {
      field: "cloudflareProjectName",
      name: "Cloudflare Pages project name",
      type: "string",
      meta: {
        width: "full",
        interface: "input",
      },
    },
  ],
});
