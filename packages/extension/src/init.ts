import * as vscode from "vscode";
import path from "path";
import { templates } from "swg-core";
import { getRootPath } from "./helpers";

/**
 * 初始化生成项目模板
 * @export
 * @returns
 */
export default async function init() {
  const rootPath = await getRootPath();

  if (!rootPath) {
    return;
  }

  let canCopyTemplates = true;

  if (templates.isTemplatesExits(rootPath)) {
    const answer = await vscode.window.showInformationMessage(
      "当前项目已存在模板文件，是否覆盖?",
      "是",
      "否"
    );
    canCopyTemplates = answer === "是";
  }

  try {
    const templateDirPath = path.resolve(__dirname, "../_templates");

    canCopyTemplates && templates.copyTemplates(rootPath, templateDirPath);
    vscode.window.showInformationMessage("初始化完成！");
  } catch (error) {
    console.log(error);
  }
}
