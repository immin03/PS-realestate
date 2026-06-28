import { spawn, execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

process.env.NODE_OPTIONS = process.env.NODE_OPTIONS
  ? `${process.env.NODE_OPTIONS} --use-system-ca`
  : "--use-system-ca";

execSync("node scripts/generate-config.js", { stdio: "inherit", cwd: ROOT });

function start(command, args) {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: true,
    cwd: ROOT,
    env: process.env,
  });
  child.on("exit", (code) => shutdown(code ?? 0));
  return child;
}

let stopping = false;
const children = [];

function shutdown(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) child.kill();
  process.exit(code);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

children.push(
  start("npx", [
    "--yes",
    "netlify-cli",
    "functions:serve",
    "-f",
    "netlify/functions",
    "-p",
    "9000",
    "--offline",
  ])
);
children.push(start("node", ["dev-server.mjs"]));
