import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as fse from 'fs-extra';
import { runner } from 'hygen';

import { getApiName } from '../core/utils';
import { PathInfo } from '../core/types';

// 命令前缀
import { COMMAND_PREFIX, TEMPLATE_DIR_NAME } from './settings';

/**
 * 获取命令名称
 * @param {string} name 名称
 * @returns
 */
const getCommandName = (name: string) => `${COMMAND_PREFIX}.${name}`;

/**
 * 获取项目名称
 * @param {string} workspaceFolder 项目文件夹目录
 */
const getWorkspaceName = (workspaceFolder: string) =>
  workspaceFolder.split('/').splice(-1)[0];

/**
 * 获取项目选项列表
 * @param {string[]} workspaceFolders 项目文件夹路径列表
 */
const getWorkspaceNamePickOptions = (workspaceFolders: string[]) =>
  workspaceFolders.map((workspaceFolder) => {
    const workspaceName = getWorkspaceName(workspaceFolder);
    return {
      label: workspaceName,
      workspaceFolder,
    };
  });

/**
 * 获取根目录
 * @returns
 */
const getRootPath = async () => {
  const workspaceFolders = vscode.workspace.workspaceFolders?.map(
    (folder) => folder.uri.fsPath
  );

  const currentActiveFilePath =
    vscode.window.activeTextEditor?.document.uri.fsPath;

  if (!workspaceFolders) {
    vscode.window.showErrorMessage('请先打开项目！');
    return;
  }

  const currentActiveFileWorkspaceFilder =
    currentActiveFilePath &&
    workspaceFolders?.find((item) => currentActiveFilePath?.startsWith(item));

  if (currentActiveFileWorkspaceFilder) {
    return currentActiveFileWorkspaceFilder;
  }

  const workspaceNamePickOptions =
    getWorkspaceNamePickOptions(workspaceFolders);

  const pick = await vscode.window.showQuickPick(workspaceNamePickOptions, {
    placeHolder: '请选择项目',
  });
  return pick && pick.workspaceFolder;
};

/**
 * 获取模板目录
 * @param {string} rootPath 根目录
 */
const getTemplatesPath = (rootPath: string) =>
  path.join(rootPath, TEMPLATE_DIR_NAME);

/**
 * 模板文件是否存在
 * @param {string} rootPath 根目录
 */
const isTemplatesExits = (rootPath: string) =>
  fs.existsSync(getTemplatesPath(rootPath));

/**
 * 复制模板
 * @param {string} rootPath 根目录
 */
const copyTemplates = (rootPath: string) => {
  const src = path.resolve(__dirname, '../_templates');
  const dest = getTemplatesPath(rootPath);

  fse.copySync(src, dest);
};

/**
 * 格式化生成结果
 * @param {PathInfo} api API信息
 * @param {*} [result] hygen返回信息
 * @returns
 */
const formatGenResult = (api: PathInfo, result?: any) => {
  const apiName = getApiName(api);
  const str = apiName;

  if (result && !result.success) {
    return `${str}  失败原因:${result.failure?.message || ''}`;
  }

  return str;
};

export {
  getCommandName,
  getRootPath,
  isTemplatesExits,
  copyTemplates,
  formatGenResult,
};
