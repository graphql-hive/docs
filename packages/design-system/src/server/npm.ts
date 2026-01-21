/* eslint-disable no-console -- show errors and debug */
import semver from 'semver';

type Package = {
  createdAt: string;
  description: string;
  readme: string;
  updatedAt: string;
  weeklyNPMDownloads: number;
};

const cache: Record<string, Package> = {};

export function withoutStartingSlash(v: string) {
  if (v === '/') return v;
  if (v.startsWith('/')) return v.slice(1);
  return v;
}

export function withoutTrailingSlash(v: string) {
  if (v === '/') return v;
  if (v.endsWith('/')) return v.slice(0, - 1);
  return v;
}

export function withStartingSlash(v: string) {
  if (v.startsWith('/')) return v;
  return `/${v}`;
}

async function tryRemoteReadme(repo: string, path: string) {
  const fetchPath = `https://raw.githubusercontent.com/${withoutStartingSlash(
    withoutTrailingSlash(repo),
  )}/HEAD${withStartingSlash(path)}`;

  try {
    const response = await fetch(fetchPath, {
      method: 'GET',
    });

    if (response.status === 404) {
      console.error(`ERROR | ${fetchPath} Not Found`);
    }

    return await response.text();
  } catch (error) {
    console.error(
      `[@theguild/components] ERROR | Error while trying to get README from GitHub ${fetchPath}`,
    );
    console.error(error);

    return null;
  }
}

const NO_NPM_README_PLACEHOLDER = 'ERROR: No README data found!';

export const fetchPackageInfo = async (
  packageName: string,
  githubReadme?: {
    path: string;
    repo: string;
  },
): Promise<Package> => {
  // cache since we fetch same data on /plugins and /plugins/:name pages
  const cacheKey = githubReadme ? `${githubReadme.repo}${githubReadme.path}` : packageName;

  const cachedData = cache[cacheKey];
  if (cachedData) {
    return cachedData;
  }

  const encodedName = encodeURIComponent(packageName);
  console.debug(`Loading NPM package info: ${packageName}`);
  const [packageInfo, { downloads }] = await Promise.all([
    fetch(`https://registry.npmjs.org/${encodedName}`).then(response => response.json()),
    fetch(`https://api.npmjs.org/downloads/point/last-week/${encodedName}`).then(response =>
      response.json(),
    ),
  ]);

  const { description, readme, time } = packageInfo;
  const latestVersion = packageInfo['dist-tags'].latest;
  const readmeContent =
    githubReadme && (await tryRemoteReadme(githubReadme.repo, githubReadme.path));

  cache[cacheKey] = {
    createdAt: time.created,
    description,
    readme:
      readmeContent ||
      (readme !== NO_NPM_README_PLACEHOLDER && readme) ||
      // for some reason top level "readme" can be empty string, so we get the latest version readme
      Object.values(packageInfo.versions as { readme?: string; version: string }[])
        .reverse()
        .find(curr => {
          const isReadmeExist = curr.readme && curr.readme !== NO_NPM_README_PLACEHOLDER;
          if (isReadmeExist) {
            return semver.lte(curr.version, latestVersion);
          }
        })?.readme ||
      '',
    updatedAt: time.modified,
    weeklyNPMDownloads: downloads,
  };

  return cache[cacheKey];
};
