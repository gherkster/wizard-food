import crypto from "node:crypto";

import { imageAspectRatio, type ImagePurpose } from "@wizard/content";

import { type CloudinaryRuntimeConfig } from "../utils/config";

const imageWidths: Record<ImagePurpose, number[]> = {
  cover: [600, 800, 1200, 1600], // Header image
  preview: [400, 600, 800], // Card grids
};

const imageSizes: Record<ImagePurpose, string> = {
  preview: "(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw",
  cover: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, vw",
};

const transformToCloudinaryVersion = (modifiedOn: string): number => {
  const timestamp = Math.floor(new Date(modifiedOn).getTime() / 1000);
  if (!Number.isFinite(timestamp) || timestamp <= 0) {
    throw new Error(
      `Unable to generate Cloudinary cache-busting version from modifiedOn value: ${modifiedOn}`,
    );
  }

  return timestamp;
};

const buildTransformation = (width: number): string => {
  const { x, y } = imageAspectRatio;
  /**
   * Cloudinary Transformation Parameters:
   * c_fill: Resize to fill dimensions
   * g_auto: AI-based subject centering
   * ar_x:y: Force aspect ratio
   * w_xxx: Target width in pixels
   * f_auto: Best format (AVIF/WebP)
   * q_auto: Smart quality compression
   */
  return `c_fill,g_auto,ar_${x}:${y},w_${width},f_auto,q_auto`;
};

const generateCloudinaryDeliverySignature = (signingKey: string, slug: string) => {
  const hash = crypto.createHash("sha1").update(`${slug}${signingKey}`).digest("base64");
  return `s--${hash.substring(0, 8).replaceAll("+", "-").replaceAll("/", "_")}--`;
};

const buildSignedUrl = (
  config: CloudinaryRuntimeConfig,
  imageId: string,
  modifiedOn: string,
  transformation: string,
) => {
  const version = transformToCloudinaryVersion(modifiedOn);
  const versionPath = `v${version}`;
  const publicId = `${config.imageFolder}/${imageId}`;
  const signedSlug = `${transformation}/${versionPath}/${publicId}`;
  const signature = generateCloudinaryDeliverySignature(config.signingKey, signedSlug);
  const signedUrl = `https://res.cloudinary.com/${config.cloudName}/image/upload/${signature}/${signedSlug}`;

  const url = new URL(signedUrl);
  url.searchParams.set("v", String(version));

  return {
    url: url.toString(),
    version,
  };
};

export const buildImageVariant = (
  config: CloudinaryRuntimeConfig,
  imageId: string,
  modifiedOn: string,
  purpose: ImagePurpose,
) => {
  const widths = imageWidths[purpose];

  const variants = widths.map((width) => {
    const transformation = buildTransformation(width);
    const { url } = buildSignedUrl(config, imageId, modifiedOn, transformation);

    return {
      width,
      url,
    };
  });

  const largestVariant = variants.at(-1);
  if (!largestVariant) {
    throw new Error(`No widths configured for ${purpose}`);
  }

  return {
    src: largestVariant.url,
    srcSet: variants.map((v) => `${v.url} ${v.width}w`).join(", "),
    sizes: imageSizes[purpose],
  };
};
