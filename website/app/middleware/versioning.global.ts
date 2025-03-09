let searchIndexDownload: Promise<void> | null = null;
let isBuildStale = false;

const buildVersionStorageKey = "build-version";
const searchIndexHashStorageKey = "search-index-hash";
const lastCheckTimeStorageKey = "last-version-check";

/**
 * Periodically check for an outdated client build or search index.
 * This prevents clients that were downloaded and cached a while ago from persisting index.html or an old search index,
 * which would potentially lead to errors or stale content.

 * This is done seamlessly in the background, either doing a full page load during a navigation
 * or downloading and swapping in the new search index in the background
 */
export default defineNuxtRouteMiddleware((to) => {
  if (!import.meta.client) {
    return;
  }

  const lastVersionCheckMs = Number(localStorage.getItem(lastCheckTimeStorageKey));

  const fiveMinutesInMs = 1000 * 60 * 5;
  if (lastVersionCheckMs && lastVersionCheckMs > Date.now() - fiveMinutesInMs) {
    return;
  }

  if (isBuildStale) {
    isBuildStale = false;
    // Do a full page refresh to reload index.html and any changed scripts/styles during an existing user navigation
    reloadNuxtApp({
      path: to.path,
    });
  }

  // Check for newer versions in the background to avoid delaying navigation
  getLatestVersionNumbers()
    .then((version) => {
      if (!version) {
        return;
      }

      const isSearchIndexStale = checkForStaleSearchIndex(version.searchIndex);
      if (isSearchIndexStale) {
        /*
        Trigger a background download of the latest search index,
        skipping if there are any already active requests to prevent duplicate requests
      */
        if (!searchIndexDownload) {
          searchIndexDownload = useSearch()
            .refreshIndex()
            .finally(() => {
              localStorage.setItem(searchIndexHashStorageKey, version.searchIndex);
              searchIndexDownload = null;
            });
        }
      }

      /*
      If the search index is downloading we don't want to trigger a full page load and cancel a pending request.
      It can always happen after the next navigation, an old build won't immediately affect the user experience.
    */
      if (!searchIndexDownload && checkForStaleBuild(version.build)) {
        localStorage.setItem("build-version", version.build);
        isBuildStale = true;
      }
    })
    .catch((e) => {
      console.error(e);
    });

  localStorage.setItem(lastCheckTimeStorageKey, Date.now().toString());
});

async function getLatestVersionNumbers(): Promise<Version | undefined> {
  const { data: data } = await useFetch<Version>("/version.json");
  return data.value;
}

function checkForStaleBuild(latestVersion: string) {
  const currentVersion = localStorage.getItem(buildVersionStorageKey);
  // If the version is not set then we can assume it is a fresh page load and the build will be up to date
  if (!currentVersion) {
    localStorage.setItem(buildVersionStorageKey, latestVersion);
    return false;
  }

  if (currentVersion === latestVersion) {
    return false;
  }

  return true;
}

function checkForStaleSearchIndex(latestVersion: string) {
  const currentVersion = localStorage.getItem(searchIndexHashStorageKey);
  if (currentVersion === latestVersion) {
    return false;
  }

  return true;
}
