import { type Readable } from "stream";

import { defineHook } from "@directus/extensions-sdk";

const base64UrlMetadataKey = "base64Url";

interface DirectusFileAsset {
  id: string;
  metadata: {
    [base64UrlMetadataKey]?: string;
  };
}

export default defineHook(({ action, init }, context) => {
  const { database, getSchema, services } = context;
  const { AssetsService, ItemsService } = services;

  // Generate and append the base64 thumbnail image url to any images without it on startup
  init("routes.custom.after", async () => {
    const schema = await getSchema();

    const itemsService = new ItemsService<DirectusFileAsset>("directus_files", {
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

  // Generate and append the base64 thumbnail image url to any uploaded image
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
        // This is the ratio of the images (4:3) used by the website
        width: 40,
        height: 30,
        fit: "cover",
        format: "webp",
        withoutEnlargement: true,
      },
    });

    const buffer = await streamToBuffer(stream);
    const base64String = buffer.toString("base64");

    const dataUrl = `data:image/webp;base64,${base64String}`;

    const imageItem = await itemsService.readOne(key);
    let metadata = imageItem.metadata;

    metadata ||= {};
    metadata[base64UrlMetadataKey] = dataUrl;

    await itemsService.updateOne(key, { metadata: metadata });
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
