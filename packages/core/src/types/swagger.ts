type Method = "get" | "post" | "put" | "delete" | "patch" | "head" | "options";
type SchemaType =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "array"
  | "file"
  | "object";

type ParameterIn = "query" | "header" | "path" | "formData" | "body";

interface Schema {
  $ref?: string;
}

export interface SchemaDefinition {
  id?: string;
  type?: SchemaType;
  properties?: Record<string, SchemaProperty>;
}

interface SchemaProperty {
  format?: string;
  type?: SchemaType;
  $ref?: string;
  enum?: string[];
  items?: {
    format?: string;
    type?: SchemaType;
    enum?: string[];
  };
}

interface ParameterItem {
  type?: SchemaType;
  enum?: string[];
}

interface Parameter {
  description: string;
  name: string;
  in: ParameterIn;
  required: boolean;
  type?: SchemaType;
  format?: string;
  schema: Schema;
  items?: ParameterItem[];
}

interface Response {
  description: string;
  schema: Schema;
}

interface Security {
  [key: string]: string[];
}

interface SecurityDefinition {
  type: string;
  name: string;
  in: string;
}

export interface Tag {
  name: string;
  description: string;
}

export interface PathMethod {
  consumes: string[];
  deprecated: boolean;
  operationId: string;
  parameters: Parameter[];
  produces: string[];
  responses: Record<string, Response>;
  security: Security[];
  summary: string;
  tags: string[];
}

export type Path = Record<Method, PathMethod>;

export type Paths = Record<string, Path>;

export interface Info {
  version: string;
  title: string;
}

export interface SwaggerDoc {
  basePath: string;
  definitions: Record<string, SchemaDefinition>;
  host: string;
  info: Info;
  paths: Paths;
  securityDefinitions: Record<string, SecurityDefinition>;
  swagger: string;
  tags: Tag[];
}
