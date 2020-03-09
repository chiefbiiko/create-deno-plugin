export const LIB_TS: string = `
const filenameBase = "test_plugin";

let filenameSuffix = ".so";
let filenamePrefix = "lib";

if (Deno.build.os === "win") {
  filenameSuffix = ".dll";
  filenamePrefix = "";
}
if (Deno.build.os === "mac") {
  filenameSuffix = ".dylib";
}

const filename = \`../target/\${Deno.args[0]}/\${filenamePrefix}\${filenameBase}\${filenameSuffix}\`;

const { testSync, testAsync } = Deno.openPlugin(filename).ops;

const textDecoder = new TextDecoder();

// TODO: indicate control buf and zero copy length requirements
// TODO: import std.strings.encode
// TODO: shortline filename derivation

function runTestSync() {
  const response = testSync.dispatch(
    new Uint8Array([116, 101, 115, 116]),
    new Uint8Array([116, 101, 115, 116])
  );

  console.log(\`Plugin Sync Response:  \${textDecoder.decode(response)}\`);
}

testAsync.setAsyncHandler(response => {
  console.log(\`Plugin Async Response:  \${textDecoder.decode(response)}\`);
});

function runTestAsync() {
  const response = testAsync.dispatch(
    new Uint8Array([116, 101, 115, 116]),
    new Uint8Array([116, 101, 115, 116])
  );

  if (response) {
    throw new Error("Expected nullish async response!");
  }
}

runTestSync();
runTestAsync();
`.trim();
