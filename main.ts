const textEncoder: TextEncoder = new TextEncoder();

const GIT_IGNORE: Uint8Array = textEncoder.encode("target\n");

const CARGO_TOML: Uint8Array = textEncoder.encode(`
[package]
name = "TODO"
version = "0.0.0"
authors = ["TODO <TODO>"]
edition = "2018"

[lib]
crate-type = ["cdylib"]

[dependencies]
futures = "0.3.4"
deno_core = "0.35.0"
`.trim());

const LIB_RS: Uint8Array = textEncoder.encode(`
#[macro_use]
extern crate deno_core;
extern crate futures;

use deno_core::{Buf, CoreOp, Op, PluginInitContext, ZeroCopyBuf};
use futures::future::FutureExt;

fn init(context: &mut dyn PluginInitContext) {
  context.register_op("testSync", Box::new(op_test_sync));
  context.register_op("testAsync", Box::new(op_test_async));
}

init_fn!(init);

pub fn op_test_sync(data: &[u8], zero_copy: Option<ZeroCopyBuf>) -> CoreOp {
  // mutate zero_copy if u like
  
  let result = b"wave from plugin op sync deno rust";
  let result_box: Buf = Box::new(*result);
  
  Op::Sync(result_box)
}

pub fn op_test_async(data: &[u8], zero_copy: Option<ZeroCopyBuf>) -> CoreOp {
  let fut = async move {
    // mutate zero_copy if u like
    
    let result = b"wave from plugin op async deno rust";
    let result_box: Buf = Box::new(*result);
    
    Ok(result_box)
  };

  Op::Async(fut.boxed())
}
`.trim());

const LIB_TS: Uint8Array = textEncoder.encode(`
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
`.trim());

await Deno.mkdir("src");

await Promise.all([
  Deno.writeFile(".gitignore", GIT_IGNORE),
  Deno.writeFile("Cargo.toml", CARGO_TOML),
  Deno.writeFile("src/lib.rs", LIB_RS),
  Deno.writeFile("lib.ts", LIB_TS)
]);
