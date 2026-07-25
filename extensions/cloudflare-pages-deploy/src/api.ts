import { defineOperationApi } from "@directus/extensions-sdk";
import Cloudflare from "cloudflare";

import {
  type Options,
  type BuildLogsResponse,
  type BuildStatusResponse,
  type DeployHookResponse,
  type Logger,
} from "./types";

export default defineOperationApi<Options>({
  id: "cloudflare-pages-deploy",
  handler: async (options, { env, logger }) => {
    logger.info("Starting cloudflare pages deployment");

    const { buildUuid } = await triggerDeployment(options.deployHookUrl, logger);

    const cloudflare = new Cloudflare({
      apiToken: env["CLOUDFLARE_PAGES_DEPLOYMENT_API_TOKEN"],
    });

    return pollBuildStatus(cloudflare, options.cloudflareAccountId, buildUuid, logger);
  },
});

const POLL_INTERVAL_MS = 30 * 1000;
const MAX_POLL_ATTEMPTS = 20;

async function triggerDeployment(
  deployHookUrl: string,
  logger: Logger,
): Promise<{ buildUuid: string; initialStatus: string; alreadyExists: boolean }> {
  const response = await fetch(deployHookUrl, { method: "POST" });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Deploy hook returned status ${response.status}: ${errorText}`);
  }

  const data = (await response.json()) as DeployHookResponse;

  if (!data.success) {
    throw new Error(`Deploy hook failed: ${data.errors.join(", ")}`);
  }

  logger.info(
    `Triggered deployment build_uuid=${data.result.build_uuid} initial_status=${data.result.status}`,
  );

  if (data.result.already_exists) {
    logger.info("A deployment is already in progress. Polling existing deployment.");
  }

  return {
    buildUuid: data.result.build_uuid,
    initialStatus: data.result.status,
    alreadyExists: data.result.already_exists,
  };
}

async function fetchBuildLogs(
  cloudflare: Cloudflare,
  accountId: string,
  buildUuid: string,
): Promise<string | undefined> {
  const logsResponse = (await cloudflare.get(
    `/accounts/${accountId}/builds/builds/${buildUuid}/logs`,
    { method: "get" },
  )) as BuildLogsResponse;

  return logsResponse.result?.data;
}

async function pollBuildStatus(
  cloudflare: Cloudflare,
  accountId: string,
  buildUuid: string,
  logger: Logger,
): Promise<BuildStatusResponse["result"]> {
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
    const buildResponse = (await cloudflare.get(
      `/accounts/${accountId}/builds/builds/${buildUuid}`,
      { method: "get" },
    )) as BuildStatusResponse;

    const status = buildResponse.result?.status;

    logger.info(
      `Deployment build_uuid=${buildUuid} status=${status} attempt=${attempt + 1}/${MAX_POLL_ATTEMPTS}`,
    );

    if (status === "success") {
      logger.info(`Deployment ${buildUuid} completed successfully`);
      return buildResponse.result;
    }

    if (status === "failure") {
      logger.error(`Deployment ${buildUuid} failed. Fetching build logs.`);

      try {
        const logs = await fetchBuildLogs(cloudflare, accountId, buildUuid);
        if (logs) {
          logger.error(`Build logs for ${buildUuid}: ${logs}`);
        }
      } catch (logsError) {
        logger.error(`Failed to fetch build logs: ${JSON.stringify(logsError)}`);
      }

      throw new Error(`Deployment ${buildUuid} failed with status: ${status}`);
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  throw new Error(`Deployment ${buildUuid} timed out after ${MAX_POLL_ATTEMPTS} attempts`);
}
