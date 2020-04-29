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
  --dir=/usr/local/bin \
  create-deno-plugin \
  https://denopkg.com/chiefbiiko/create-deno-plugin@v0.1.0/main.ts
```

## usage

``` sh
create-deno-plugin v0.2.0

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
```

## license

[MIT](./LICENSE)