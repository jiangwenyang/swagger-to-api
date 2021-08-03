import * as vscode from 'vscode';
import { getRootPath } from './helpers';
import { EXTENSION_NAME, CONFIG_FILE_NAME, DEFAULT_CONF } from './settings';
import { cosmiconfig } from 'cosmiconfig';
import { Config } from './types';

/**
 * 获取配置
 * @export
 * @returns
 */
export default async function getConfig(): Promise<Config | undefined> {
  const rootPath = await getRootPath();
  if (!rootPath) {
    return;
  }
  const explorerSync = cosmiconfig(CONFIG_FILE_NAME);
  const configResult = await explorerSync.search(rootPath);
  const { config = {} } = configResult || {};

  const workspaceConfig =
    vscode.workspace.getConfiguration(EXTENSION_NAME) || {};

  return { ...DEFAULT_CONF, ...workspaceConfig, ...config };
}
