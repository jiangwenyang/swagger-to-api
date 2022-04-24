import fetch from "node-fetch";
import type { RequestInit } from "node-fetch";
import type { SwaggerDoc } from "./types/swagger";

export default async function fetchDocs(
  url: string,
  options?: RequestInit
): Promise<SwaggerDoc | undefined> {
  try {
    const response = await fetch(url, options);
    if (response.ok) {
      const data = (await response.json()) as SwaggerDoc;

      return data;
    }
    return;
  } catch (error) {
    console.log(error);
    return;
  }
}
