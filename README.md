# create-deno-plugin

![ci](https://github.com/chiefbiiko/create-deno-plugin/workflows/ci/badge.svg)

a little tool to bootstrap deno plugins

## install

install the script as a command line tool

``` sh
deno install \
  --allow-env \
  --allow-read \
  --allow-write \
  --name=create-deno-plugin \
  https://denopkg.com/chiefbiiko/create-deno-plugin@v0.3.0/main.ts
```

## usage

``` sh
create-deno-plugin --async ./my-plugin
cd ./my-plugin
cargo build
deno test --allow-plugin --unstable
```

the tool scaffolds as illustrated:

```
|-- my-plugin
|   |-- .gitignore
|   |-- Cargo.toml
|   |-- src
|   |   |-- lib.rs
|   |-- mod.js
|   |-- test.js
```
switching on `--async` will include async function stubs on the rust and deno side and in the test file

## help

``` sh
create-deno-plugin v0.3.0

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
  
  NOTE: currently, you cannot use typescript wrapper modules - only vanilla js
        see https://github.com/denoland/deno/issues/5525

ARGS:
  [path]    directory path of the new plugin
            defaults to the current working directory
            if provided but the directory does not exist it will be created
```

## license

[MIT](./LICENSE)