export const resolveConfig = (): CloudinaryRuntimeConfig => {
  const signingKey = process.env.CLOUDINARY_API_KEY;
  if (!signingKey) {
    throw new Error("CLOUDINARY_API_KEY environment variable not defined.");
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    throw new Error("CLOUDINARY_CLOUD_NAME environment variable not defined.");
  }

  const imageFolder = process.env.CLOUDINARY_IMAGE_FOLDER;
  if (!imageFolder) {
    throw new Error("CLOUDINARY_IMAGE_FOLDER environment variable not defined.");
  }

  return {
    cloudName,
    signingKey,
    imageFolder,
  };
};

export type CloudinaryRuntimeConfig = {
  cloudName: string;
  signingKey: string;
  imageFolder: string;
};
