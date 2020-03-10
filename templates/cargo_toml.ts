export function cargoToml(
  { name, author, email, async }: {
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
[package]
name = "${name}"
version = "0.0.0"
authors = ["${author} <${email}>"]
edition = "2018"

[lib]
crate-type = ["cdylib"]

[dependencies]
deno_core = "0.35.0"${async ? '\nfutures = "0.3.4"' : ""}
  `.trim();
}
