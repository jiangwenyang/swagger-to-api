import fetch from 'node-fetch';
import { Config, SwaggerDoc } from './types';

/**
 * 获取文档
 * @export
 * @param {config} Config 文档配置
 * @returns {Promise<any>}
 */
export default async function fetchDocs(
  config: Config
): Promise<SwaggerDoc | undefined> {
  const { url, ...otherConfig } = config;
  try {
    const response = await fetch(url, otherConfig);
    if (response.ok) {
      const data = await response.json();

      return data;
    }
  } catch (error) {
    console.log(error);
  }
}
