import type { ImagePurpose } from "~/types/image";

export function useImage() {
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

    const relativeUrl = buildRelativeUrl({ imageId, modifyDate, purpose });

    return `${appConfig.externalUrl}${relativeUrl}`;
  }
  return {
    buildRelativeUrl,
    buildExternalUrl,
  };
}
