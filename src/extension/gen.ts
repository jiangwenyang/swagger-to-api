import * as vscode from 'vscode';
import { runner, Logger } from 'hygen';

import { PathInfo } from '../core/types';
import {
  getRootPath,
  formatGenResult,
  isTemplatesExits,
  getCommandName,
} from './helpers';
import prepareApi from './prepareApi';
import { GENERATOR, ACTION } from './settings';

type Result = {
  api: PathInfo;
  result: any;
};

/**
 * 执行hygen生成
 * @param {PathInfo} api API信息
 * @param {string} rootPath 根目录
 * @returns
 */
const hygen = (api: PathInfo, rootPath: string) => {
  const argv = Object.entries(api).flatMap(([key, value]) => {
    try {
      value = JSON.stringify(value);
    } catch (error) {
      console.log(value);
    }
    return [`--${key}`, value];
  });
  return runner([GENERATOR, ACTION, ...argv], {
    templates: '',
    cwd: rootPath,
    logger: new Logger(console.log.bind(console)),
    debug: !!process.env.DEBUG,
    exec: (action, body) => {
      const opts = body && body.length > 0 ? { input: body } : {};
      return require('execa').command(action, { ...opts, shell: true });
    },
    createPrompter: () => require('enquirer'),
  });
};

/**
 * 显示API生成结果
 * @param {Result[]} successList 成功列表
 * @param {Result[]} failureList 失败列表
 */
const showResult = (successList: Result[], failureList: Result[]) => {
  const outputChanel = vscode.window.createOutputChannel('swagger-to-api');

  successList.length &&
    outputChanel.appendLine(
      '--------生成成功API（注：跳过也视为生成成功）--------'
    );
  successList.forEach(({ api }) =>
    outputChanel.appendLine(formatGenResult(api))
  );

  failureList.length && outputChanel.appendLine('--------生成失败API--------');
  failureList.forEach(({ api, result }) =>
    outputChanel.appendLine(formatGenResult(api, result))
  );

  if (!failureList.length) {
    vscode.window.showInformationMessage('生成API成功！');
  } else {
    vscode.window.showErrorMessage('API生成失败，请检查模板配置！');
  }
  outputChanel.show();
  outputChanel.dispose();
};

/**
 * 生成API
 * @export
 * @returns
 */
export default async function gen() {
  const rootPath = await getRootPath();

  if (!rootPath) {
    return;
  }

  if (!isTemplatesExits(rootPath)) {
    vscode.window.showErrorMessage(
      `模板不存在，请使用命令 "${getCommandName('init')}" 初始化！`
    );
    return;
  }

  const apis = await prepareApi(rootPath);

  if (!(apis && apis.length)) {
    return;
  }

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Window,
      cancellable: false,
      title: '获取接口文档中...',
    },
    async (progress) => {
      progress.report({ increment: 0 });

      const successList = [];
      const failureList = [];

      for (let i = 0; i < apis.length; i++) {
        const api = apis[i];

        const result = await hygen(api, rootPath);

        const resultInfo = {
          api,
          result,
        };

        if (result.success) {
          successList.push(resultInfo);
        } else {
          failureList.push(resultInfo);
        }
      }

      showResult(successList, failureList);

      progress.report({ increment: 100 });
    }
  );
}
