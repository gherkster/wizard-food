import * as path from "path";
import * as fs from "fs/promises";

// Proxy search index lookup due to local dev fetching issue
export default defineEventHandler(async () => {
  const filePath = path.join(process.cwd(), "public", "search-index.json");
  return await fs.readFile(filePath, "utf-8");
});
