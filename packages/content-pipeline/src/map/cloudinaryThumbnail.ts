import { type CloudinaryRuntimeConfig } from "../utils/config";

import { buildSignedUrl, buildTransformation } from "./cloudinaryImage";

const thumbnailWidth = 40;
const thumbnailQuality = 20;
const thumbnailFetchAttempts = 3;

/**
 * Fetches the base64 thumbnail data url for an image, using the same
 * transformation as the full size variants so the blurred placeholder always
 * shows the same crop as the image which replaces it.
 */
export const fetchBase64Thumbnail = async (
  config: CloudinaryRuntimeConfig,
  imageId: string,
  modifiedOn: string,
) => {
  const transformation = buildTransformation(thumbnailWidth, thumbnailQuality);
  const { url } = buildSignedUrl(config, imageId, modifiedOn, transformation);

  let lastError: unknown;
  for (let attempt = 1; attempt <= thumbnailFetchAttempts; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Cloudinary responded with ${response.status} ${response.statusText}`);
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      assertIsWebp(buffer, imageId);

      return `data:image/webp;base64,${buffer.toString("base64")}`;
    } catch (error) {
      lastError = error;
      if (attempt < thumbnailFetchAttempts) {
        await delay(attempt * 500);
      }
    }
  }

  throw new Error(
    `Unable to fetch base64 thumbnail for image ${imageId} after ${thumbnailFetchAttempts} attempts`,
    { cause: lastError },
  );
};

/**
 * Guard against silently embedding a non-webp response (e.g. an error page
 * returned with a 200 status) as a data:image/webp url.
 */
const assertIsWebp = (buffer: Buffer, imageId: string) => {
  if (
    buffer.length < 12 ||
    buffer.subarray(0, 4).toString("latin1") !== "RIFF" ||
    buffer.subarray(8, 12).toString("latin1") !== "WEBP"
  ) {
    throw new Error(`Thumbnail response for image ${imageId} is not a webp image`);
  }
};

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
