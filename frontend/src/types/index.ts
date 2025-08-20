export interface GenerationOptions {
  namespace: string;
  name: string;
  version: 'v2_doc' | 'v2_typed' | 'v3';
  flexible: boolean;
  nested: boolean;
}

export type ApiResponse = string | Blob;

export interface DtoExample {
  title: string;
  description: string;
  json: string;
  dto: string;
  usage: string;
}