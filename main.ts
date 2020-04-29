import { encode, existsSync, join } from "./deps.ts";
import { params } from "./params.ts";
import { GIT_IGNORE } from "./templates/git_ignore.ts";
import { cargoToml } from "./templates/cargo_toml.ts";
import { libRS } from "./templates/lib_rs.ts";
import { modTS } from "./templates/mod_ts.ts";

async function maybe(path: string, gen: () => Uint8Array): Promise<void> {
  if (params.force || !existsSync(path)) {
    return Deno.writeFile(path, gen());
  }
}

const VERSION: string = "v0.2.0";

const HELP: string = `
create-deno-plugin ${VERSION}

blueprints a deno plugin

USAGE: create-deno-plugin [OPTIONS] [path]

OPTIONS:
  -v, --version    print version
  -h, --help       print usage instructions
      --name       set the plugin name
      --author     set the plugin author's name
      --email      set the plugin author's email
      --async      include async function stubs
  -f, --force      overwrite existing files

  if not provided the plugin name, author and its email address will be read
  from environment variables and git config files.

  if async is not set no async function stubs will be included in lib.rs and
  mod.ts

  

ARGS:
  [path]    directory path of the new plugin
            defaults to the current working directory
            if provided but the directory does not exist it will be created
`
  .trim();

if (params.version) {
  console.log(`${VERSION}`);
  Deno.exit(0);
} else if (params.help) {
  console.log(HELP);
  Deno.exit(0);
}

Deno.mkdirSync(join(params.path, "src"), { recursive: true });

await Promise.allSettled([
  maybe(
    join(params.path, ".gitignore"),
    (): Uint8Array => encode(GIT_IGNORE),
  ),
  maybe(
    join(params.path, "Cargo.toml"),
    (): Uint8Array => encode(cargoToml(params)),
  ),
  maybe(
    join(params.path, "src", "lib.rs"),
    (): Uint8Array => encode(libRS(params)),
  ),
  maybe(
    join(params.path, "mod.ts"),
    (): Uint8Array => encode(modTS(params)),
  ),
]);
