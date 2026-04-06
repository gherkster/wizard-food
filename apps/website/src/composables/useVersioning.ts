import type { AppVersion } from "@/types/version";
import { useSearch } from "@/composables/useSearch";

let searchIndexDownload: Promise<void> | null = null;
let isBuildStale = false;
let isInitialized = false;
let teardown: (() => void) | null = null;

const buildVersionStorageKey = "build-version";
const searchIndexHashStorageKey = "search-index-hash";
const lastCheckTimeStorageKey = "last-version-check";
const fiveMinutesInMs = 1000 * 60 * 5;

export function useVersioning() {
  const start = () => {
    if (typeof window === "undefined") {
      return;
    }

    if (isInitialized) {
      return;
    }

    const runCheck = () => {
      void maybeRefreshVersions();
    };

    runCheck();
    document.addEventListener("astro:after-swap", runCheck);
    window.addEventListener("popstate", runCheck);

    teardown = () => {
      document.removeEventListener("astro:after-swap", runCheck);
      window.removeEventListener("popstate", runCheck);
    };

    isInitialized = true;
  };

  const stop = () => {
    if (!isInitialized) {
      return;
    }

    teardown?.();
    teardown = null;
    isInitialized = false;
  };

  return {
    start,
    stop,
  };
}

const maybeRefreshVersions = async () => {
  const lastVersionCheckMs = Number(localStorage.getItem(lastCheckTimeStorageKey));

  if (lastVersionCheckMs > Date.now() - fiveMinutesInMs) {
    return;
  }

  if (isBuildStale) {
    isBuildStale = false;
    window.location.reload();
    return;
  }

  try {
    const version = await getLatestVersionNumbers();
    if (!version) {
      return;
    }

    const isSearchIndexStale = checkForStaleSearchIndex(version.searchIndex);
    if (isSearchIndexStale && !searchIndexDownload) {
      searchIndexDownload = useSearch()
        .refreshIndex()
        .finally(() => {
          localStorage.setItem(searchIndexHashStorageKey, version.searchIndex);
          searchIndexDownload = null;
        });
    }

    if (!searchIndexDownload && checkForStaleBuild(version.build)) {
      localStorage.setItem(buildVersionStorageKey, version.build);
      isBuildStale = true;
    }
  } catch (error) {
    console.error(error);
  } finally {
    localStorage.setItem(lastCheckTimeStorageKey, Date.now().toString());
  }
};

const getLatestVersionNumbers = async (): Promise<AppVersion | undefined> => {
  const response = await fetch("/version.json", {
    cache: "no-store",
  });

  if (!response.ok) {
    return;
  }

  return (await response.json()) as AppVersion;
};

const checkForStaleBuild = (latestVersion: string) => {
  const currentVersion = localStorage.getItem(buildVersionStorageKey);

  // If the version is not set then we can assume it is a fresh page load and the build will be up to date.
  if (!currentVersion) {
    localStorage.setItem(buildVersionStorageKey, latestVersion);
    return false;
  }

  return currentVersion !== latestVersion;
};

const checkForStaleSearchIndex = (latestVersion: string) => {
  const currentVersion = localStorage.getItem(searchIndexHashStorageKey);
  return currentVersion !== latestVersion;
};
