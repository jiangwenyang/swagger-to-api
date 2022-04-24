import * as vscode from "vscode";

// 命令前缀
import { COMMAND_PREFIX, TEMPLATE_DIR_NAME } from "./settings";

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
  workspaceFolder.split("/").splice(-1)[0];

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
    vscode.window.showErrorMessage("请先打开项目！");
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
    placeHolder: "请选择项目",
  });

  return pick && pick.workspaceFolder;
};

export { getCommandName, getRootPath };
