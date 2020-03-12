# create-deno-plugin

a little tool to bootstrap deno plugins

## using it

you can either install the script as a command line tool:

```
deno install \
  --allow-env \
  --allow-read \
  --allow-write \
  --dir=/usr/local/bin \
  create-deno-plugin \
  https://denopkg.com/chiefbiiko/create-deno-plugin@v0.1.0/main.ts

create-deno-plugin --help
```

or just reference it directly:

```
deno --allow-plugin https://denopkg.com/chiefbiiko/create-deno-plugin@v0.1.0/main.ts --help
```