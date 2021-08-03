export interface Config {
  url: string;
}

export interface PathMethod {
  path: string;
  method: string;
  tags: string[];
  summary: string;
  operationId: string;
  parameters: Record<string, any>[];
}

export interface Tag {
  name: string;
  description: string;
}

interface Info {
  version: string;
  title: string;
}

export interface SwaggerDoc {
  swagger: string;
  host: string;
  info: Info;
  basePath: string;
  tags: Tag[];
  paths: Record<string, any>;
  definitions: Record<string, any>;
}

type Paths = Array<PathMethod>;

type Tags = Array<Tag>;

export interface Docs {
  swagger: string;
  info: Info;
  host: string;
  basePath: string;
  tags: Tags;
  paths: Paths;
  definitions: Record<string, any>;
}

export type PathInfo = PathMethod &
  Omit<Docs, 'paths' | 'tags' | 'definitions'>;
