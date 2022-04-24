import type { SwaggerDoc, PathMethod, Tag } from "./swagger";

interface PathInfo extends PathMethod {
  path: string; // 路径
  method: string; // 请求方法
  tagInfos: Tag[]; // 标签对象列表
  // TODO: 序列化parameters
}

export type BaseSwaggerDoc = Omit<SwaggerDoc, "paths" | "tags" | "definitions">;

export type DocPath = PathInfo & BaseSwaggerDoc;

export interface SerializedPathsGroupByTag extends Tag {
  serializedPaths: DocPath[]; // 序列化后的method列表
}

export interface Doc extends SwaggerDoc {
  serializedPaths: DocPath[]; // 序列化后的paths
  serializedPathsGroupByTag: SerializedPathsGroupByTag[]; // 按标签分组的序列化列表
}
