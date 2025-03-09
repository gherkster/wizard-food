import { defineHook } from "@directus/extensions-sdk";
import * as Services from "@directus/api/dist/services";
import type { Readable } from "stream";

const base64UrlMetadataKey = "base64Url";

export default defineHook(({ action, init }, { services, database, getSchema }) => {
  const { AssetsService, ItemsService } = services as typeof Services;

  // Add metadata to any images without it on extension load
  init("routes.custom.after", async () => {
    const schema = await getSchema();

    const itemsService = new ItemsService("directus_files", {
      knex: database,
      schema: schema,
    });

    const images = await itemsService.readByQuery({
      fields: ["id", "metadata"],
      filter: {
        type: {
          _in: ["image/jpeg", "image/png", "image/webp", "image/tiff"],
        },
      },
      limit: -1,
    });

    for (const image of images) {
      if (image.metadata[base64UrlMetadataKey]) {
        continue;
      }

      await addBase64ToImageMetadata(image.id);
    }
  });

  action("files.upload", async ({ payload, key }) => {
    if (!["image/jpeg", "image/png", "image/webp", "image/tiff"].includes(payload.type)) {
      // Skip non-image files
      return;
    }

    await addBase64ToImageMetadata(key);
  });

  const addBase64ToImageMetadata = async (key: string) => {
    const schema = await getSchema();

    const assetsService = new AssetsService({
      schema: schema,
      knex: database,
    });

    const itemsService = new ItemsService("directus_files", {
      knex: database,
      schema: schema,
    });

    const { stream } = await assetsService.getAsset(key, {
      transformationParams: {
        quality: 20,
        // This is the ratio of portrait images (3:4) which tend to be the largest images,
        // so that any ratio mismatch will be less noticeable.
        // However they will be so heavily blurred it's unlikely to be noticed.
        width: 30,
        height: 40,
        fit: "cover",
        format: "webp",
      },
    });

    const buffer = await streamToBuffer(stream);
    const base64String = buffer.toString("base64");

    const dataUrl = `data:image/webp;base64,${base64String}`;

    const imageItem = await itemsService.readOne(key);
    let metadata = imageItem.metadata;

    metadata ||= {};
    metadata[base64UrlMetadataKey] = dataUrl;

    itemsService.updateOne(key, { metadata: metadata });
    console.log(`Added base64 image URL to ${key}`);
  };
});

const streamToBuffer = async (stream: Readable): Promise<Buffer> => {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks);
};
