import { SwaggerDoc, Docs, PathMethod, Tag } from './types';

/**
 * 序列化参数列表
 * @param {Record<string, any>[]} parameters 参数列表
 * @param {Record<string, any>} definitions 定义对象
 * @returns
 */
const serializeParameters = (
  parameters: Record<string, any>[],
  definitions: Record<string, any>
) => {
  return parameters.map((item) => {
    const { schema: { $ref: ref = '' } = {}, ...others } = item;

    return {
      ...others,
      schema: definitions[ref.split('/').splice(-1)[0]]
    };
  });
};

/**
 * 序列化路径方法
 * @param {string} path 路径
 * @param {string} method 方法
 * @param {Record<string, any>} methodInfo 方法信息
 * @param {Record<string, any>} definitions 定义对象
 * @returns {PathMethod}
 */
const serializeMethod = (
  path: string,
  method: string,
  methodInfo: Record<string, any>,
  definitions: Record<string, any>
): PathMethod => {
  const { tags, summary, operationId, parameters } = methodInfo;
  return {
    path,
    method,
    tags,
    summary,
    operationId,
    parameters: parameters ? serializeParameters(parameters, definitions) : []
  };
};

/**
 * 序列化路径
 * @param {string} path 路径
 * @param {Record<string, any>} methodsInfo 路径对应的methods信息
 * @param {Record<string, any>} definitions 当前所有定义
 */
const serializePath = (
  path: string,
  methodsInfo: Record<string, any>,
  definitions: Record<string, any>
) => {
  return Object.entries(methodsInfo).map(([method, methodInfo]) =>
    serializeMethod(
      path,
      method,
      methodInfo as Record<string, any>,
      definitions
    )
  );
};

/**
 * 序列化路径列表
 * @param {Record<string, any>} paths swagger路径信息
 * @param {Record<string, any>} definitions swagger definitions 信息
 * @returns
 */
function serializePaths(
  paths: Record<string, any>,
  definitions: Record<string, any>
) {
  return Object.entries(
    paths
  ).flatMap(([path, methodsInfo]: [string, Record<string, any>]) =>
    serializePath(path, methodsInfo as Record<string, any>, definitions)
  );
}

/**
 * 序列化swagger文档
 * @export
 * @param {SwaggerDoc} docs
 * @returns {Docs}
 */
export default function serializeDoc(docs: SwaggerDoc): Docs {
  const { host, swagger, info, basePath, tags, paths, definitions } = docs;

  return {
    host,
    swagger,
    info,
    basePath,
    tags,
    paths: serializePaths(paths, definitions),
    definitions
  };
}
