import { useImage } from "../../../app/composables/useImage";
import type { AspectRatio, ImagePurpose } from "../../../shared/types/image";
import { imageFileExtension } from "../../../shared/constants/images";

interface Env {
  CLOUDINARY_API_KEY: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  if (!context.env.CLOUDINARY_API_KEY) {
    throw new Error("Cloudinary API key environment variable not defined");
  }

  const imageIdParams = context.params.images;
  const imageId = typeof imageIdParams === "object" ? imageIdParams[0] : imageIdParams;

  const { searchParams } = new URL(context.request.url);
  const purpose = searchParams.get("purpose") as ImagePurpose;
  const aspectRatio = searchParams.get("aspectRatio") as AspectRatio;

  const image = useImage();
  const { x, y } = image.getAspectRatio(aspectRatio);

  // TODO: Build URL properly
  let transformations = "";
  switch (purpose) {
    case "cover": {
      transformations = `c_fill,w_720,ar_${x}:${y}/`;
      break;
    }
    case "instruction":
    case "preview": {
      transformations = `ar_${x}:${y},c_crop/ar_${x}:${y},c_fit,h_480/`;
      break;
    }
    default: {
      throw new Error(`Purpose: ${purpose} is not supported`);
    }
  }

  const fileName = `v1/recipes/${imageId}.${imageFileExtension}`;
  const signingParameters = `${transformations}${fileName}`;

  if (!transformations) {
    // Don't allow downloading the original images, as they may be inappropriately sized or contain unwanted metadata
    throw new Error("Transformation not specified, requesting original images is not allowed");
  }

  const signature = await generateCloudinaryDeliverySignature(context.env, signingParameters);
  const imageUrl = `https://res.cloudinary.com/dork0lbv9/image/upload/${signature}/${transformations}${fileName}`;

  return fetch(imageUrl, {
    cf: {
      cacheTtl: 5,
    },
  });
};

/**
 * https://cloudinary.com/documentation/advanced_url_delivery_options#generating_delivery_url_signatures
 */
async function generateCloudinaryDeliverySignature(env: Env, urlSlug: string) {
  const hash = await crypto.subtle.digest(
    "SHA-1",
    new TextEncoder().encode(`${urlSlug}${env.CLOUDINARY_API_KEY}`),
  );
  const bytes = new Uint8Array(hash);
  const base64Secret = btoa(String.fromCharCode(...bytes));

  let signature = "s--" + base64Secret.substring(0, 8) + "--";
  // Make URL-safe
  signature = signature.replaceAll("+", "-").replaceAll("/", "_");

  return signature;
}
