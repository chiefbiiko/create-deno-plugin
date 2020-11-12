export function modJS(
  { name, async }: {
    name: string;
    author: string;
    email: string;
    path: string;
    version?: boolean;
    help?: boolean;
    async?: boolean;
  },
): string {
  return `
var pluginPath = [
  "target",
  "debug",
  (Deno.build.os + "" === "windows" ? "" : "lib") +
  "${name}".replace(/-/g, "_") +
  (Deno.build.os + "" === "windows"
    ? ".dll"
    : Deno.build.os + "" === "darwin"
    ? ".dylib"
    : ".so"),
].join("/");

// NOTE: Deno.close(pluginId) once u r done
var pluginId = Deno.openPlugin(pluginPath);
var { ${async ? "asyncOp: asyncOpId, " : ""}syncOp: syncOpId } = Deno.core.ops();

export function syncOpWrapper(zeroCopy) {
  return Deno.core.dispatch(syncOpId, zeroCopy);
}

${async
    ? `export function asyncOpWrapper(zeroCopy) {
  return new Promise(function (resolve, reject) {
    try {
      Deno.core.setAsyncHandler(asyncOpId, resolve);
      Deno.core.dispatch(asyncOpId, zeroCopy);
    } catch (err) {
      return reject(err);
    }
  });
}`
    : ""}
  `.trim();
}
