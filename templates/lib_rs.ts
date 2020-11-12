export function libRS(
  { async }: {
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
use deno_core::{${async ? "\n    futures::FutureExt," : ""}
    plugin_api::{Interface, Op, ZeroCopyBuf},
};
use std::boxed::Box;

#[no_mangle]
pub fn deno_plugin_init(interface: &mut dyn Interface) {
    interface.register_op("syncOp", op_sync);${async ? '\n    interface.register_op("asyncOp", op_async);' : ""}
}

pub fn op_sync(_interface: &mut dyn Interface, zero_copy: &mut [ZeroCopyBuf]) -> Op {
    // impl code, maybe return a value and/or mutate zero_copy bufs...
    if zero_copy.is_empty() {}
    for (_idx, _buf) in zero_copy.to_vec().iter().enumerate() {}
    zero_copy[0][0..4].copy_from_slice(b"ACAB");
    // FYI: the empty slice return value below will appear as undefined in js
    // if we return a lengthy slice here it will appear as a Uint8Array in js
    Op::Sync(Box::new([]))
}

${async
    ? `pub fn op_async(_interface: &mut dyn Interface, _zero_copy: &mut [ZeroCopyBuf]) -> Op {
    let fut = async move { Box::new(*b"ACAB") as Box<[u8]> };
    Op::Async(fut.boxed())
}`
    : ""}
  `.trim();
}
