export function cargoToml(
  { name, author, email }: {
    name: string;
    author: string;
    email: string;
    path: string;
    force: boolean;
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
  futures = "0.3.4"
  deno_core = "0.35.0"
  `.trim();
}
