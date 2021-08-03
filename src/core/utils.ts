import { Tag, PathMethod, PathInfo } from './types';

function getTag(name: string, tags: Tag[]): Tag | undefined {
  if (!(name && Array.isArray(tags) && tags.length)) {
    return;
  }
  return tags.find((item) => item.name === name);
}

interface PathsGroupByTag {
  [key: string]: PathMethod[];
}

const getPathsGroupByTag = (paths: PathMethod[]) => {
  if (!paths) {
    return {};
  }

  return paths.reduce((pre, item) => {
    item.tags.forEach((tag) => {
      if (pre[tag]) {
        pre[tag].push(item);
      } else {
        pre[tag] = [item];
      }
    });
    return pre;
  }, {} as PathsGroupByTag);
};

const getApiName = (api: PathInfo) => {
  const { path, method, summary } = api;

  return `${path} - ${method} (${summary})`;
};

export { getTag, getPathsGroupByTag, getApiName };
