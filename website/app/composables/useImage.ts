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
  }: {
    imageId: string;
    modifyDate: string;
    purpose: ImagePurpose;
    aspectRatio: AspectRatio;
  }) {
    const params = new URLSearchParams({
      modifyDate: modifyDate,
      purpose: purpose,
      aspectRatio: aspectRatio,
    });

    return `/api/images/${imageId}?${params}`;
  }

  function buildExternalUrl({
    imageId,
    modifyDate,
    purpose,
    aspectRatio,
  }: {
    imageId: string;
    modifyDate: string;
    purpose: ImagePurpose;
    aspectRatio: AspectRatio;
  }) {
    const appConfig = useAppConfig();
    if (!appConfig.externalBaseUrl) {
      throw new Error("NUXT_PUBLIC_SITE_URL environment variable is not defined");
    }

    const relativeUrl = buildRelativeUrl({ imageId, modifyDate, purpose, aspectRatio });

    return `${appConfig.externalBaseUrl}${relativeUrl}`;
  }
  return {
    buildRelativeUrl,
    buildExternalUrl,
    getAspectRatio,
  };
}
