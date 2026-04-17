import type MiniSearch from "minisearch";

import type { AppVersion } from "@/models/version";
import { fetchSearchIndex } from "@/lib/search/search-client";

import { SearchIndexSearchFields } from "./search/search-types";

let searchIndexDownload: Promise<MiniSearch<SearchIndexSearchFields> | undefined> | undefined;
let isBuildStale = false;

const buildVersionStorageKey = "build-version";
const searchIndexHashStorageKey = "search-index-hash";
const lastCheckTimeStorageKey = "last-version-check";

const getLatestVersionNumbers = async (): Promise<AppVersion | undefined> => {
  const response = await fetch("/version.json", { cache: "no-store" });
  if (!response.ok) {
    return undefined;
  }

  return (await response.json()) as AppVersion;
};

const checkForStaleBuild = (latestVersion: string) => {
  const currentVersion = window.localStorage.getItem(buildVersionStorageKey);

  if (!currentVersion) {
    window.localStorage.setItem(buildVersionStorageKey, latestVersion);
    return false;
  }

  return currentVersion !== latestVersion;
};

const checkForStaleSearchIndex = (latestVersion: string) => {
  const currentVersion = window.localStorage.getItem(searchIndexHashStorageKey);
  return currentVersion !== latestVersion;
};

export const checkAppVersion = async (nextPath: string) => {
  if (typeof window === "undefined") {
    return;
  }

  const lastVersionCheckMs = Number(window.localStorage.getItem(lastCheckTimeStorageKey));
  const fiveMinutesInMs = 1000 * 60 * 5;

  if (!isNaN(lastVersionCheckMs) && lastVersionCheckMs > Date.now() - fiveMinutesInMs) {
    return;
  }

  if (isBuildStale) {
    isBuildStale = false;
    window.location.assign(nextPath);
    return;
  }

  try {
    const version = await getLatestVersionNumbers();
    if (!version) {
      return;
    }

    // Check if the current search index is stale based on the remote version, and check that we aren't already downloading the remote one
    if (checkForStaleSearchIndex(version.searchIndex) && !searchIndexDownload) {
      searchIndexDownload = fetchSearchIndex()
        .catch((error) => {
          console.error(error);

          return undefined;
        })
        .finally(() => {
          window.localStorage.setItem(searchIndexHashStorageKey, version.searchIndex);

          searchIndexDownload = undefined;
        });
    }

    // Check if the current build is stale, i.e. the user has left the tab open and another code deployment has happened since
    if (!searchIndexDownload && checkForStaleBuild(version.build)) {
      window.localStorage.setItem(buildVersionStorageKey, version.build);
      isBuildStale = true;
    }
  } catch (error) {
    console.error(error);
  } finally {
    window.localStorage.setItem(lastCheckTimeStorageKey, Date.now().toString());
  }
};
