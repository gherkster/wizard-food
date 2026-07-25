import { defineOperationApp } from "@directus/extensions-sdk";

export default defineOperationApp({
  id: "cloudflare-pages-deploy",
  name: "Deploy cloudflare pages",
  icon: "rocket_launch",
  description: "Deploy a cloudflare pages instance",
  overview: ({ cloudflareAccountId }) => [
    {
      label: "Account ID",
      text: cloudflareAccountId,
    },
  ],
  options: [
    {
      field: "cloudflareAccountId",
      name: "Cloudflare account ID",
      type: "string",
      meta: {
        width: "full",
        interface: "input",
      },
    },
    {
      field: "deployHookUrl",
      name: "Deploy hook URL",
      type: "string",
      meta: {
        width: "full",
        interface: "input",
        note: "The deploy hook URL from your Cloudflare Workers project. Triggers a new deployment.",
      },
    },
  ],
});
