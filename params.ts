import { basename, decode, existsSync, parse } from "./deps.ts";

const NEW_LINE_REGEX: RegExp = /\r?\n/;
const GIT_CONFIG_USER_SECTION_PATTERN: RegExp = /\[user\]/i;

function gitAuthorEmail(configFile: string): {
  author: undefined | string;
  email: undefined | string;
} {
  if (!existsSync(configFile)) {
    return { author: undefined, email: undefined };
  }

  const fileContents: string = decode(Deno.readFileSync(configFile));

  if (!GIT_CONFIG_USER_SECTION_PATTERN.test(fileContents)) {
    return { author: undefined, email: undefined };
  }

  const lines: string[] = fileContents
    .split(NEW_LINE_REGEX)
    .map((line: string): string =>
      GIT_CONFIG_USER_SECTION_PATTERN.test(line)
        ? line.trim().toLowerCase()
        : line.trim()
    )
    .filter((line: string): boolean =>
      !!line && !line.startsWith("#") && !line.startsWith(";")
    );

  const head: number = lines.indexOf("[user]") + 1;

  const tail: number = lines
    .slice(head)
    .reduce(
      (acc: number, line: string, i: number): number =>
        line.startsWith("[") ? i : acc,
      Infinity
    );

  const userLines: string[] = lines.slice(head, tail);

  const userSection: { [key: string]: string } = userLines
    .reduce(
      (acc: { [key: string]: string }, userLine: string): {
        [key: string]: string;
      } => {
        const [key, value]: string[] = userLine
          .split("=")
          .map((part: string): string => part.trim());

        acc[key.toLowerCase()] = value;

        return acc;
      },
      {}
    );

  return {
    author: userSection.name,
    email: userSection.email
  };
}

const ENV: { [key: string]: string } = Deno.env();
const CWD: string = Deno.cwd();
const HOME: string = Deno.dir("home") ?? "/";

const localGitConfig: {
  author: undefined | string;
  email: undefined | string;
} = gitAuthorEmail(`${CWD}/.git/config`);

const globalGitConfig: {
  author: undefined | string;
  email: undefined | string;
} = gitAuthorEmail(`${HOME}/.gitconfig`);

const argv: { [key: string]: any } = parse(Deno.args, {
  string: ["name", "author", "email"],
  boolean: ["version", "help", "async"],
  alias: { help: "h", version: "v" },
  default: {
    author: ENV.CARGO_NAME ||
      ENV.GIT_AUTHOR_NAME ||
      ENV.GIT_COMMITTER_NAME ||
      localGitConfig.author ||
      globalGitConfig.author ||
      ENV.USER ||
      ENV.USERNAME ||
      ENV.NAME ||
      "unknown",
    email: ENV.CARGO_EMAIL ||
      ENV.GIT_AUTHOR_EMAIL ||
      ENV.GIT_COMMITTER_EMAIL ||
      localGitConfig.email ||
      globalGitConfig.email ||
      ENV.EMAIL ||
      "unknown"
  }
});

argv.name = argv.name ? basename(argv.name) : "deno-plugin";

export const params: {
  name: string;
  author: string;
  email: string;
  path: string;
  version?: boolean;
  help?: boolean;
  async?: boolean;
} = {
  name: argv.name,
  author: argv.author,
  email: argv.email,
  path: argv._[0] || Deno.cwd(),
  version: argv.version,
  help: argv.help
};
