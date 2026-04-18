import path from "node:path";

import { config as loadDotEnv } from "dotenv";
import { Command } from "commander";

import { syncContent } from "./sync";

const requiredEnv = (name: string) => {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} environment variable is required`);
  }
  return value;
};

const program = new Command();

program.name("wizard-content").description("Wizard content pipeline CLI").version("1.0.0");

program
  .command("sync")
  .description("Sync website content snapshots from Directus")
  .option("--site <path>", "Website project directory", ".")
  .option("--dotenv-file <path>", "Dotenv file relative to --site", ".env")
  .option("--content-dir <path>", "Content output directory relative to --site", ".content")
  .option("--build-id <id>", "Build identifier")
  .action(async (options) => {
    const workspaceRoot = process.cwd();

    const siteDir = path.resolve(workspaceRoot, options.site);
    const envFilePath = path.resolve(siteDir, options.dotenvFile);
    const contentDir = path.resolve(siteDir, options.contentDir);

    loadDotEnv({ path: envFilePath });

    await syncContent({
      outputDir: contentDir,
      buildId: options.buildId,
      directus: {
        baseUrl: requiredEnv("NUXT_CRM_URL"),
        cfAccessClientId: requiredEnv("NUXT_CF_ACCESS_CLIENT_ID"),
        cfAccessClientSecret: requiredEnv("NUXT_CF_ACCESS_CLIENT_SECRET"),
      },
    });

    console.info("Content sync complete");
  });

program.parseAsync().catch((error) => {
  console.error(error);
  process.exit(1);
});
