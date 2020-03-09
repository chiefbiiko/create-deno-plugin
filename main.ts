import { encode } from "./deps.ts";
import { params } from "./params.ts";
import { GIT_IGNORE } from "./templates/git_ignore.ts";
import { cargoToml } from "./templates/cargo_toml.ts";
import { LIB_RS } from "./templates/lib_rs.ts";
import { LIB_TS } from "./templates/lib_ts.ts";

console.log("params", params);
// TODO:
// + path join filepaths with oarams.oath
// + --help --version

await Deno.mkdir(params.path, { recursive: true });
await Deno.mkdir("src");

await Promise.all([
  Deno.writeFile(".gitignore", encode(GIT_IGNORE)),
  Deno.writeFile("Cargo.toml", encode(cargoToml(params))),
  Deno.writeFile("src/lib.rs", encode(LIB_RS)),
  Deno.writeFile("lib.ts", encode(LIB_TS))
]);
