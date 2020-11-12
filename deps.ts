// export { existsSync } from "https://deno.land/std@0.77.0/fs/mod.ts";
export { parse } from "https://deno.land/std@0.77.0/flags/mod.ts";
export { basename, join } from "https://deno.land/std@0.77.0/path/mod.ts";

export function existsSync(filePath: string): boolean {
  try {
    Deno.lstatSync(filePath);
    return true;
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return false;
    }
    throw err;
  }
}

const textEncoder: TextEncoder = new TextEncoder();
const textDecoder: TextDecoder = new TextDecoder();

export function encode(str: string): Uint8Array {
  return textEncoder.encode(str);
}

export function decode(buf: Uint8Array): string {
  return textDecoder.decode(buf);
}
