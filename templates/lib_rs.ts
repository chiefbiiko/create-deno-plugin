export const LIB_RS: string = `
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
`.trim();