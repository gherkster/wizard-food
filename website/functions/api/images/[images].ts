import { useImage } from "../../../composables/useImage";
import type { AspectRatio, ImagePurpose } from "../../../types/image";

interface Env {
  BUCKET: R2Bucket;
  CLOUDINARY_API_KEY: string;
}

// TODO: Make sure images are caching correctly with the modifyDate cache-busting mechanism
export const onRequestGet: PagesFunction<Env> = async (context) => {
  // TODO: Check in R2 and use that if exists

  if (!context.env.CLOUDINARY_API_KEY) {
    throw new Error("Cloudinary API key environment variable not defined");
  }

  // TODO: Be able to vary image sizes and create thumbnails
  const imageId = context.params.images;

  const { searchParams } = new URL(context.request.url);
  const purpose = searchParams.get("purpose") as ImagePurpose;
  const aspectRatio = searchParams.get("aspectRatio") as AspectRatio;

  const thumbnail = searchParams.get("thumbnail") === "true";

  const image = useImage();
  const { x, y } = image.getAspectRatio(aspectRatio);

  // TODO: Build URL properly
  let transformations = "";
  switch (purpose) {
    case "cover": {
      transformations = thumbnail ? `c_thumb,w_48,ar_${x}:${y}/` : `c_fill,w_720,ar_${x}:${y}/`;
      break;
    }
    case "instruction":
    case "preview": {
      transformations = thumbnail ? `ar_${x}:${y},c_thumb,w_48/` : `ar_${x}:${y},c_crop/ar_${x}:${y},c_fit,h_480/`;
      break;
    }
    default: {
      throw new Error(`Purpose: ${purpose} is not supported`);
    }
  }

  // TODO: Handle no transformations
  const fileName = `v1/recipes/${imageId}.webp`;
  const signingParameters = `${transformations}${fileName}`;

  // Check for image in r2
  // if in r2 then return image
  // if not, then get image from cloudinary and cache into r2
  // just follow what https://github.com/kotx/render does for now, performance testing can come later to validate

  // TODO: Make parameters dynamic (but also don't allow abuse through small adjustments)
  // TODO: Make image extension not needed (or provided in request if required)

  // TODO: Directus allows specifying a focal point of the image,
  // use this to make thumbnails/crops focus on the subject properly
  // https://cloudinary.com/documentation/resizing_and_cropping#special_positions

  const signature = await generateCloudinaryDeliverySignature(context.env, signingParameters);
  // TODO: Handle no transformations
  const imageUrl = `https://res.cloudinary.com/dork0lbv9/image/upload/${signature}/${transformations}${fileName}`;

  return fetch(imageUrl);
};

/**
 * https://cloudinary.com/documentation/advanced_url_delivery_options#generating_delivery_url_signatures
 */
async function generateCloudinaryDeliverySignature(env: Env, urlSlug: string) {
  const hash = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(`${urlSlug}${env.CLOUDINARY_API_KEY}`));
  const bytes = new Uint8Array(hash);
  const base64Secret = btoa(String.fromCharCode(...bytes));

  let signature = "s--" + base64Secret.substring(0, 8) + "--";
  // Make URL-safe
  signature = signature.replaceAll("+", "-").replaceAll("/", "_");

  return signature;
}
