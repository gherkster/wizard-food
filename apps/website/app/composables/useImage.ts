import { imageFileExtension } from "~~/shared/constants/images";

export function useImage() {
  function getAspectRatio(aspectRatio: AspectRatio): { x: number; y: number } {
    switch (aspectRatio) {
      case "portrait":
        return {
          x: 3,
          y: 4,
        };
      case "square":
        return {
          x: 1,
          y: 1,
        };
    }
  }

  type ImageUrlParams = {
    id: string;
    fileName: string;
    modifyDate: string;
    purpose: ImagePurpose;
    aspectRatio: AspectRatio;
  };

  function buildRelativeUrl(image: ImageUrlParams) {
    const params = new URLSearchParams({
      modifyDate: image.modifyDate,
      purpose: image.purpose,
      aspectRatio: image.aspectRatio,
    });

    return `/api/images/${image.id}/${image.fileName}.${imageFileExtension}?${params}`;
  }

  function buildExternalUrl(image: ImageUrlParams) {
    const appConfig = useAppConfig();
    if (!appConfig.externalBaseUrl) {
      throw new Error("NUXT_PUBLIC_SITE_URL environment variable is not defined");
    }

    const relativeUrl = buildRelativeUrl(image);

    return `${appConfig.externalBaseUrl}${relativeUrl}`;
  }
  return {
    buildRelativeUrl,
    buildExternalUrl,
    getAspectRatio,
  };
}
