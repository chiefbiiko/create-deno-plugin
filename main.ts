import { encode, join } from "./deps.ts";
import { params } from "./params.ts";
import { GIT_IGNORE } from "./templates/git_ignore.ts";
import { cargoToml } from "./templates/cargo_toml.ts";
import { libRS } from "./templates/lib_rs.ts";
import { modTS } from "./templates/mod_ts.ts";

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

  if not provided the plugin name, author and its email address will be read
  from environment variables and git config files.

  if async is not set no async function stubs will be included in lib.rs and
  lib.ts

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
  Deno.writeFile(join(params.path, ".gitignore"), encode(GIT_IGNORE)),
  Deno.writeFile(join(params.path, "Cargo.toml"), encode(cargoToml(params))),
  Deno.writeFile(join(params.path, "src", "lib.rs"), encode(libRS(params))),
  Deno.writeFile(join(params.path, "mod.ts"), encode(modTS(params)))
]);
