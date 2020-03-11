export function libTS(
  { name, async }: {
    name: string;
    author: string;
    email: string;
    path: string;
    version?: boolean;
    help?: boolean;
    async?: boolean;
  }
): string {
  return `
const pluginPath: string = [
  "target",
  "debug",
  Deno.build.os === "win" ? "" : "lib",
  "${name}".replace(/-/g, "_"),
  Deno.build.os === "win" ? ".dll" : Deno.build.os === "mac" ? ".dylib" : ".so"
].join("/");

const plugin = Deno.openPlugin(pluginPath);

export function syncWrapper(): null | Uint8Array {
  const response: null | Uint8Array = plugin.ops.testSync.dispatch(
    new Uint8Array([116, 101, 115, 116]), // control
    buf                                   // zero copy
  );

  return response;
}

${
async
?
`export function asyncWrapper(): Promise<null | Uint8Array> {
  return new Promise((resolve, reject) => {
    // FIXME: promises won't necessarily settle in order
    plugin.ops.testAsync.setAsyncHandler(resolve);

    plugin.ops.testAsync.dispatch(
      new Uint8Array([116, 101, 115, 116]), // control
      new Uint8Array(0)                     // zero copy
    );
  });
}`
:
""
}
  `.trim();
}
