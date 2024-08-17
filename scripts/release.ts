import process from "node:process";
import { execSync } from "node:child_process";
import fs from "fs-extra";
// import { readJSONSync } from "fs-extra"; // error, The requested module 'fs-extra' does not provide an export named 'readJSONSync'

const { version: oldVersion } = fs.readJSONSync("package.json");
execSync("bumpp -r --no-commit --no-tag --no-push", { stdio: "inherit" });
const { version } = fs.readJSONSync("package.json");

if (oldVersion === version) {
  console.log("canceled");
  process.exit();
}

execSync("git add .", { stdio: "inherit" });
execSync(`git commit -m "chore: release v${version}"`, { stdio: "inherit" });
execSync(`git tag -a v${version} -m "v${version}"`, { stdio: "inherit" });

// The changelog will be generated only after tagging. Therefore, you must execute `pnpm changelog` after tagging.
execSync("pnpm changelog");
execSync("git add .", { stdio: "inherit" });
execSync(`git commit -m "chore: release v${version}"`, { stdio: "inherit" });
