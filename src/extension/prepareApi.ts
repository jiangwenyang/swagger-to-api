import * as vscode from 'vscode';
import getConfig from './getConfig';
import getDocs from '../core/index';
import { Docs, PathMethod, PathInfo } from '../core/types';
import { getPathsGroupByTag } from '../core/utils';

// 选择并获取文档
const prepareDocs = async (rootPath?: string) => {
  const { services } = (await getConfig(rootPath)) || {};

  if (!(services && services.length)) {
    vscode.window.showErrorMessage('请先配置服务地址！');
    return;
  }

  const servicesPickOptions = services.map((item) => ({
    label: item.name,
    url: item.url,
  }));

  const service = await vscode.window.showQuickPick(servicesPickOptions, {
    placeHolder: '请选择服务',
  });

  if (!service) {
    return;
  }

  return await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Window,
      cancellable: false,
      title: '获取接口文档中...',
    },
    async (progress) => {
      progress.report({ increment: 0 });

      const docs = await getDocs(service);

      progress.report({ increment: 100 });

      return docs;
    }
  );
};

// 选择API
const selectAPI = async (docs: Docs) => {
  const { paths, tags, definitions, ...otherInfo } = docs;

  const tagsPickOptions = tags.map((item) => ({
    label: item.name,
    description: item.description,
  }));

  const selectedTag = await vscode.window.showQuickPick(tagsPickOptions, {
    placeHolder: '请选择服务分类',
  });

  if (!selectedTag) {
    return;
  }

  const pathsGroupByTag = getPathsGroupByTag(paths);

  const currentTagPaths = pathsGroupByTag[selectedTag.label] as PathMethod[];

  if (!currentTagPaths) {
    vscode.window.showInformationMessage('当前服务分类下没有可用API');
    return;
  }

  const pathPickOptions = currentTagPaths.map((item) => ({
    label: item.path,
    description: item.method,
    detail: item.summary,
    _pathInfo: item,
  }));

  const selectedPaths = await vscode.window.showQuickPick(pathPickOptions, {
    placeHolder: '请选择API',
    canPickMany: true,
  });

  if (!selectedPaths) {
    return;
  }

  return selectedPaths.map((item) => ({
    ...item._pathInfo,
    ...otherInfo,
  })) as PathInfo[];
};

/**
 * API生成获取选择
 * @export
 * @param {string} [rootPath]
 * @returns
 */
export default async function prepareAPI(rootPath?: string) {
  const docs = await prepareDocs(rootPath);

  if (!docs) {
    vscode.window.showErrorMessage('获取接口文档失败，请检查配置！');
    return;
  }

  return selectAPI(docs);
}
