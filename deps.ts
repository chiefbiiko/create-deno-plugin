export { existsSync } from "https://deno.land/std@v0.41.0/fs/mod.ts";
export { parse } from "https://deno.land/std@v0.41.0/flags/mod.ts";
export { basename, join } from "https://deno.land/std@v0.41.0/path/mod.ts";

const textEncoder: TextEncoder = new TextEncoder();
const textDecoder: TextDecoder = new TextDecoder();

export function encode(str: string): Uint8Array {
  return textEncoder.encode(str);
}

export function decode(buf: Uint8Array): string {
  return textDecoder.decode(buf);
}
