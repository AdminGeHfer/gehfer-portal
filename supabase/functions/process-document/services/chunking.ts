import { CONFIG } from "../config.ts";

export function splitIntoChunks(text: string): string[] {
  const chunks: string[] = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    const endIndex = Math.min(startIndex + CONFIG.CHUNK_SIZE, text.length);
    chunks.push(text.slice(startIndex, endIndex));
    startIndex = endIndex - CONFIG.CHUNK_OVERLAP;
  }

  return chunks;
}