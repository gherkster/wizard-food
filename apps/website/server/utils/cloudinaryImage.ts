import crypto from "crypto";
import { imageFileExtension } from "../../shared/constants/images";
import type { AspectRatio, ImagePurpose, ImageVariants } from "../../shared/types/image";

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
  return Number.isFinite(timestamp) && timestamp > 0 ? timestamp : 1;
};

const buildTransformation = (aspectRatio: AspectRatio, width: number): string => {
  const { x, y } = getAspectRatio(aspectRatio);
  return `c_fill,g_auto,ar_${x}:${y},w_${width},f_${imageFileExtension},q_auto`;
};

/**
 * https://cloudinary.com/documentation/advanced_url_delivery_options#generating_delivery_url_signatures
 */
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

  return {
    url: `https://res.cloudinary.com/${config.cloudName}/image/upload/${signature}/${signedSlug}`,
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
    const { url, version } = buildSignedUrl(config, imageId, modifiedOn, transformation);

    return {
      width,
      url,
      version,
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
    cloudinaryVersion: largestVariant.version,
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
  } satisfies Record<ImagePurpose, Record<AspectRatio, { src: string; srcSet: string; sizes: string; cloudinaryVersion: number }>>;

  return {
    cloudinaryVersion: variants.cover.square.cloudinaryVersion,
    variants: {
      cover: {
        portrait: {
          src: variants.cover.portrait.src,
          srcSet: variants.cover.portrait.srcSet,
          sizes: variants.cover.portrait.sizes,
        },
        square: {
          src: variants.cover.square.src,
          srcSet: variants.cover.square.srcSet,
          sizes: variants.cover.square.sizes,
        },
      },
      preview: {
        portrait: {
          src: variants.preview.portrait.src,
          srcSet: variants.preview.portrait.srcSet,
          sizes: variants.preview.portrait.sizes,
        },
        square: {
          src: variants.preview.square.src,
          srcSet: variants.preview.square.srcSet,
          sizes: variants.preview.square.sizes,
        },
      },
      instruction: {
        portrait: {
          src: variants.instruction.portrait.src,
          srcSet: variants.instruction.portrait.srcSet,
          sizes: variants.instruction.portrait.sizes,
        },
        square: {
          src: variants.instruction.square.src,
          srcSet: variants.instruction.square.srcSet,
          sizes: variants.instruction.square.sizes,
        },
      },
    } satisfies ImageVariants,
  };
};
