interface Env {
  BUCKET: R2Bucket;
  CLOUDINARY_API_KEY: string;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  // TODO: Check in R2 and use that if exists

  // TODO: Be able to vary image sizes with hashed params
  const imageId = context.params.images;

  // Check for image in r2
  // if in r2 then return image
  // if not, then get image from cloudinary and cache into r2
  // just follow what https://github.com/kotx/render does for now, performance testing can come later to validate

  // TODO: Make parameters dynamic (but also don't allow abuse through small adjustments)
  // TODO: Make image extension not needed (or provided in request if required)
  const imageUrlSlug = `recipes/${imageId}.webp`;

  const signature = await generateCloudinaryDeliverySignature(context.env, imageUrlSlug);
  // TODO: Make account id an env variable
  const imageUrl = `https://res.cloudinary.com/dork0lbv9/image/upload/${signature}/${imageUrlSlug}`;
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
