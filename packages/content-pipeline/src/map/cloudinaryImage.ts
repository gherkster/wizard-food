import crypto from "node:crypto";

import type { AspectRatio, ImagePurpose, ImageVariants } from "@wizard/content/store";

const imageFileExtension = "avif";

type CloudinaryRuntimeConfig = {
  cloudName: string;
  signingKey: string;
  imageFolder: string;
};

const imageWidths: Record<ImagePurpose, Record<AspectRatio, number[]>> = {
  cover: {
    portrait: [320, 480, 720, 960],
    square: [320, 480, 720, 960],
  },
  preview: {
    portrait: [240, 360, 480, 640],
    square: [240, 360, 480, 640],
  },
  instruction: {
    portrait: [320, 480, 640, 800],
    square: [320, 480, 640, 800],
  },
};

const imageSizes: Record<ImagePurpose, string> = {
  cover: "(max-width: 768px) 100vw, 50vw",
  preview: "(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw",
  instruction: "(max-width: 768px) 100vw, 640px",
};

const getAspectRatio = (aspectRatio: AspectRatio) => {
  if (aspectRatio === "portrait") {
    return { x: 3, y: 4 };
  }

  return { x: 1, y: 1 };
};

const resolveConfig = (): CloudinaryRuntimeConfig => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME ?? "dork0lbv9";
  const signingKey = process.env.CLOUDINARY_API_KEY;

  if (!signingKey) {
    throw new Error(
      "Cloudinary signing key environment variable not defined. Set CLOUDINARY_API_KEY.",
    );
  }

  return {
    cloudName,
    signingKey,
    imageFolder: process.env.CLOUDINARY_IMAGE_FOLDER ?? "recipes",
  };
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

const buildTransformation = (aspectRatio: AspectRatio, width: number): string => {
  const { x, y } = getAspectRatio(aspectRatio);
  return `c_fill,g_auto,ar_${x}:${y},w_${width},f_${imageFileExtension},q_auto`;
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
  const publicId = `${config.imageFolder}/${imageId}.${imageFileExtension}`;
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

const buildVariant = (
  config: CloudinaryRuntimeConfig,
  imageId: string,
  modifiedOn: string,
  purpose: ImagePurpose,
  aspectRatio: AspectRatio,
) => {
  const widths = imageWidths[purpose][aspectRatio];
  const variants = widths.map((width) => {
    const transformation = buildTransformation(aspectRatio, width);
    const { url } = buildSignedUrl(config, imageId, modifiedOn, transformation);

    return {
      width,
      url,
    };
  });

  const largestVariant = variants.at(-1);
  if (!largestVariant) {
    throw new Error(`No widths configured for ${purpose} ${aspectRatio}`);
  }

  return {
    src: largestVariant.url,
    srcSet: variants.map((v) => `${v.url} ${v.width}w`).join(", "),
    sizes: imageSizes[purpose],
  };
};

export const buildSignedImageVariants = (image: { id: string; modifiedOn: string }) => {
  const config = resolveConfig();

  const variants = {
    cover: {
      portrait: buildVariant(config, image.id, image.modifiedOn, "cover", "portrait"),
      square: buildVariant(config, image.id, image.modifiedOn, "cover", "square"),
    },
    preview: {
      portrait: buildVariant(config, image.id, image.modifiedOn, "preview", "portrait"),
      square: buildVariant(config, image.id, image.modifiedOn, "preview", "square"),
    },
    instruction: {
      portrait: buildVariant(config, image.id, image.modifiedOn, "instruction", "portrait"),
      square: buildVariant(config, image.id, image.modifiedOn, "instruction", "square"),
    },
  } satisfies ImageVariants;

  return {
    variants,
  };
};
