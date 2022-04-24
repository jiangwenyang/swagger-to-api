import type { SwaggerDoc, PathMethod, Path, Paths, Tag } from "./types/swagger";
import type {
  DocPath,
  Doc,
  BaseSwaggerDoc,
  SerializedPathsGroupByTag,
} from "./types/doc";

/**
 * 获取标签对象
 * @param {Tag[]} tags 标签对象列表
 * @param {string} name 标签名
 */
const getTagInfo = (tags: Tag[], name: string) => {
  if (!(name && Array.isArray(tags) && tags.length)) {
    return;
  }
  return tags.find((item) => item.name === name);
};

/**
 * 获取标签对象列表
 * @param {PathMethod["tags"]} tagNames 标签名列表
 * @param {Tag[]} tags 标签对象列表
 */
const getTagInfos = (tagNames: PathMethod["tags"], tags: Tag[]) =>
  tagNames.map((name) => getTagInfo(tags, name)) as Tag[];

/**
 * 将序列化后的请求方法对象按标签分组
 * @param {DocPath[]} serializedPaths 序列化后的请求方法对象列表
 * @param {Tag[]} tags 标签对象列表
 * @return {SerializedPathsGroupByTag[]}
 */
const getSerializedPathsGroupByTag = (
  serializedPaths: DocPath[],
  tags: Tag[]
): SerializedPathsGroupByTag[] => {
  if (!serializedPaths || !tags) {
    return [];
  }
  const tagsMap = tags.reduce(
    (pre: Record<string, SerializedPathsGroupByTag>, tag) => {
      pre[tag.name] = {
        ...tag,
        serializedPaths: serializedPaths.filter((item) =>
          item.tags.includes(tag.name)
        ),
      };
      return pre;
    },
    {}
  );

  return Object.values(tagsMap);
};

/**
 * 序列化method
 * @param {string} path 请求路径
 * @param {string} method 请求方法类型
 * @param {PathMethod} pathMethod 请求对象
 * @param {Tag[]} tags 标签对象列表
 * @param {BaseSwaggerDoc} baseSwaggerDoc swagger基础信息
 * @return {*}  {DocPath}
 */
const serializeMethod = (
  path: string,
  method: string,
  pathMethod: PathMethod,
  tags: Tag[],
  baseSwaggerDoc: BaseSwaggerDoc
): DocPath => {
  return Object.assign(
    { path, method, tagInfos: getTagInfos(pathMethod.tags, tags) },
    baseSwaggerDoc,
    pathMethod
  );
};

/**
 * 序列化path（一个path有多个method）
 * @param {SwaggerDoc["basePath"]} basePath 基础路径
 * @param {string} path path路径
 * @param {Path} pathMethods 一个路径下的多个method请求对象映射
 * @param {Tag[]} tags 标签对象列表
 * @param {BaseSwaggerDoc} baseSwaggerDoc swagger基础信息
 */
const serializePath = (
  path: string,
  pathMethods: Path,
  tags: Tag[],
  baseSwaggerDoc: BaseSwaggerDoc
): DocPath[] =>
  Object.entries(pathMethods).map(([method, pathMethod]) =>
    serializeMethod(path, method, pathMethod, tags, baseSwaggerDoc)
  );

/**
 * * 序列化paths
 * @param {Paths} paths 路径-请求方法对象映射
 * @param {Tag[]} tags 标签对象列表
 * @return {DocPath[]} 序列化后的paths
 * @param {BaseSwaggerDoc} baseSwaggerDoc swagger基础信息
 */
const serializePaths = (
  paths: Paths,
  tags: Tag[],
  baseSwaggerDoc: BaseSwaggerDoc
) => {
  return Object.entries(paths).flatMap(([path, pathMethods]) =>
    serializePath(path, pathMethods, tags, baseSwaggerDoc)
  );
};

/**
 * 序列化文档
 * @param {SwaggerDoc} swaggerDoc swagger文档
 * @return {Doc}  序列化后的文档
 */
const serializeDoc = (swaggerDoc: SwaggerDoc): Doc => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { paths, tags, definitions, ...baseSwaggerDoc } = swaggerDoc;
  const serializedPaths = serializePaths(paths, tags, baseSwaggerDoc);

  return Object.assign(
    {
      serializedPaths,
      serializedPathsGroupByTag: getSerializedPathsGroupByTag(
        serializedPaths,
        tags
      ),
    },
    swaggerDoc
  );
};

export default serializeDoc;
