import * as fs from "fs";
import * as path from "path";
import * as fse from "fs-extra";

/**
 * 获取模板目录
 * @param {string} rootPath 根目录
 * @param {string} [templateDirName="_templates"] 模板名称
 */
const getTemplatesPath = (rootPath: string, templateDirName = "_templates") =>
  path.join(rootPath, templateDirName);

/**
 * 模板目录是否存在
 * @param {string} rootPath 根目录
 */
const isTemplatesExits = (rootPath: string) =>
  fs.existsSync(getTemplatesPath(rootPath));

/**
 * 复制模板
 * @param {string} rootPath 根目录
 * @param {string} templatesDirPath 模板目录路径
 */
const copyTemplates = (rootPath: string, templatesDirPath: string) => {
  const dest = getTemplatesPath(rootPath);

  fse.copySync(templatesDirPath, dest);
};

export { getTemplatesPath, isTemplatesExits, copyTemplates };
