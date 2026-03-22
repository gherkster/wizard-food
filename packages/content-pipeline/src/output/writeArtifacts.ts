import * as fs from "node:fs/promises";
import path from "node:path";

const writeJson = async (target: string, value: unknown) => {
  await fs.writeFile(target, `${JSON.stringify(value)}\n`, "utf8");
};

type Artifact = {
  filename: string;
  content: unknown;
}

export const writeContentArtifacts = async (artifacts: Artifact[], options: {
  outputDir: string;
}) => {
  await fs.mkdir(options.outputDir, { recursive: true });

  const writeOperations = artifacts.map((a) => {
    return writeJson(path.join(options.outputDir, a.filename), a.content);
  });

  await Promise.all(writeOperations);
};
