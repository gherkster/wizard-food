import type { ImagePurpose } from "~/types/image";

export function useImage() {
  function getAspectRatio(purpose: ImagePurpose): { x: number; y: number } {
    switch (purpose) {
      case "cover":
      case "instruction":
        return {
          x: 3,
          y: 4,
        };
      case "preview":
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
    thumbnail = false,
  }: {
    imageId: string;
    modifyDate: string;
    purpose: ImagePurpose;
    thumbnail?: boolean;
  }) {
    // TODO: Build URL properly
    let src = `/api/images/${imageId}?modifyDate=${modifyDate}&purpose=${purpose}`;

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

    console.log(appConfig.externalBaseUrl);

    const relativeUrl = buildRelativeUrl({ imageId, modifyDate, purpose });

    return `${appConfig.externalBaseUrl}${relativeUrl}`;
  }
  return {
    buildRelativeUrl,
    buildExternalUrl,
    getAspectRatio,
  };
}
