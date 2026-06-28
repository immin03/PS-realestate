import { existsSync, readFileSync, writeFileSync } from "node:fs";

function loadEnvFile(path) {
  const env = {};
  if (!existsSync(path)) return env;

  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

const env = { ...loadEnvFile(".env"), ...process.env };

const local = {
  ACCESS_CODE: env.ACCESS_CODE || "",
  KAKAO_JS_KEY: env.KAKAO_JS_KEY || ""
};

writeFileSync(
  "config.local.js",
  `window.APP_CONFIG_LOCAL = ${JSON.stringify(local, null, 2)};\n`,
  "utf8"
);

console.log("config.local.js generated (ACCESS_CODE, KAKAO_JS_KEY)");
