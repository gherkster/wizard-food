import type { AspectRatio, ImagePurpose } from "~/types/image";

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

  function buildRelativeUrl({
    imageId,
    modifyDate,
    purpose,
    aspectRatio,
    thumbnail = false,
  }: {
    imageId: string;
    modifyDate: string;
    purpose: ImagePurpose;
    aspectRatio: AspectRatio;
    thumbnail?: boolean;
  }) {
    // TODO: Build URL properly
    let src = `/api/images/${imageId}?modifyDate=${modifyDate}&purpose=${purpose}&aspectRatio=${aspectRatio}`;

    if (thumbnail) {
      src += "&thumbnail=true";
    }

    return src;
  }

  function buildExternalUrl({
    imageId,
    modifyDate,
    purpose,
  }: {
    imageId: string;
    modifyDate: string;
    purpose: ImagePurpose;
  }) {
    const appConfig = useAppConfig();
    if (!appConfig.externalBaseUrl) {
      throw new Error("CF_PAGES_URL environment variable is not defined");
    }

    const relativeUrl = buildRelativeUrl({ imageId, modifyDate, purpose });

    return `${appConfig.externalBaseUrl}${relativeUrl}`;
  }
  return {
    buildRelativeUrl,
    buildExternalUrl,
    getAspectRatio,
  };
}
