import { runner, Logger } from "hygen";
import { execaCommand } from "execa";
import type { DocPath } from "./types/doc";

export interface hygenOptions {
  generator?: string;
  action?: string;
}

const hygen = (
  api: DocPath,
  rootPath: string = process.cwd(),
  options: hygenOptions = {
    generator: "api",
    action: "new",
  }
) => {
  const argv = Object.entries(api).flatMap(([key, value]) => {
    if (value != null && typeof value === "object") {
      try {
        value = JSON.stringify(value);
      } catch (error) {
        console.log(value);
        return [];
      }
    }

    return [`--${key}`, value];
  });

  const { generator, action } = options;

  return runner([generator, action, ...argv], {
    templates: "",
    cwd: rootPath,
    logger: new Logger(console.log.bind(console)),
    debug: !!process.env.DEBUG,
    exec: (action, body) => {
      const opts = body && body.length > 0 ? { input: body } : {};
      return execaCommand(action, { ...opts, shell: true });
    },
    createPrompter: () => require("enquirer"),
  });
};

const generate = async (
  apis: DocPath[],
  rootPath?: string,
  options?: hygenOptions
) => {
  const resultMap = new Map();
  for (const api of apis) {
    const result = await hygen(api, rootPath, options);
    resultMap.set(api, result);
  }
  return resultMap;
};

export default generate;
