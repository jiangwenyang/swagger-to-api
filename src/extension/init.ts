import * as vscode from 'vscode';
import { getRootPath, isTemplatesExits, copyTemplates } from './helpers';

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

  if (isTemplatesExits(rootPath)) {
    const answer = await vscode.window.showInformationMessage(
      '当前项目已存在模板文件，是否覆盖?',
      '是',
      '否'
    );
    canCopyTemplates = answer === '是';
  }

  try {
    canCopyTemplates && copyTemplates(rootPath);
    vscode.window.showInformationMessage('初始化完成！');
  } catch (error) {
    console.log(error);
  }
}
