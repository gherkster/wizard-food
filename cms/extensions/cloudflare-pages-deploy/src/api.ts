import { defineOperationApi } from "@directus/extensions-sdk";
import Cloudflare from "cloudflare";
import { sleep } from "cloudflare/core";

type Options = {
  cloudflareAccountId: string;
  cloudflareProjectName: string;
};

export default defineOperationApi<Options>({
  id: "cloudflare-pages-deploy",
  handler: async (options, { env, logger }) => {
    logger.info("Starting cloudflare pages deployment");

    const cloudflare = new Cloudflare({
      apiToken: env["CLOUDFLARE_PAGES_DEPLOYMENT_API_TOKEN"],
    });

    const deployment = await cloudflare.pages.projects.deployments.create(options.cloudflareProjectName, {
      account_id: options.cloudflareAccountId,
    });

    for (let statusCheckCount = 0; statusCheckCount < 20; statusCheckCount++) {
      // Get the current status of the deployment
      const deploymentStatus = await cloudflare.pages.projects.deployments.get(
        options.cloudflareProjectName,
        deployment.id!,
        {
          account_id: options.cloudflareAccountId,
        },
      );

      if (deploymentStatus.latest_stage?.name === "deploy" && deploymentStatus.latest_stage?.status === "success") {
        logger.info(`Deployment ${deployment.id} completed successfully`);
        return deploymentStatus;
      }

      if (deploymentStatus.latest_stage?.status === "failure") {
        logger.error(`Deployment ${deployment.id} failed`);
        throw deploymentStatus;
      }

      await sleep(30 * 1000);
    }

    throw `Deployment ${deployment.id} timed out`;
  },
});
