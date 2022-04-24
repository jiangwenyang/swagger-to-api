interface Conf {}

// 扩展名称
const EXTENSION_NAME = "swg";

// 命令前缀
const COMMAND_PREFIX = EXTENSION_NAME;

// 配置文件名称
const CONFIG_FILE_NAME = "swg";

// 默认配置文件
const DEFAULT_CONF: Conf = {};

// 模板目录
const TEMPLATE_DIR_NAME = "_templates";

// 默认生成器
const GENERATOR = "api";

const ACTION = "new";

export {
  COMMAND_PREFIX,
  CONFIG_FILE_NAME,
  DEFAULT_CONF,
  EXTENSION_NAME,
  TEMPLATE_DIR_NAME,
  GENERATOR,
  ACTION,
};
