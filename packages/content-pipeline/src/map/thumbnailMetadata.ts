import type { ServerImage } from "@wizard/openapi";

/**
 * The metadata property the sync assigns the fetched base64 thumbnail to on
 * each hydrated server image, which mapImage reads back while mapping.
 */
const thumbnailMetadataKey = "base64ThumbnailUrl";

/**
 * The generated Directus schema types file metadata values as never, so the
 * string record shape is asserted at the boundary of these helpers.
 */
type Metadata = Record<string, string>;

export const setThumbnail = (image: ServerImage, thumbnail: string) => {
  const metadata = (image.metadata ?? {}) as Metadata;
  metadata[thumbnailMetadataKey] = thumbnail;
  image.metadata = metadata as ServerImage["metadata"];
};

export const getThumbnail = (image: ServerImage): string => {
  const thumbnail = (image.metadata as Metadata | null)?.[thumbnailMetadataKey];

  if (typeof thumbnail !== "string") {
    throw new Error(`Image ${image.id} has no base64 thumbnail assigned to its metadata`);
  }

  return thumbnail;
};
