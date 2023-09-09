import * as fs from "node:fs";
import pack from "./package.json";
import ChildProcess from "node:child_process";
import Logger from "lp-logger";
const logger = new Logger({
    name: "ModifyPackage",
    level: "log"
}),
    remote1 = ChildProcess.execFileSync("git remote").toString().replace(/\n/g, "");
logger.log(`检测到第一顺位remote为${remote1}`)
ChildProcess.execSync(`git pull ${remote1} main`);
let commits = Number(ChildProcess.execSync("git log --oneline | wc -l").toString().replace(/\n/g, "")),
    oldPackage = <typeof pack>JSON.parse(fs.readFileSync("package.json").toString());
commits++;
oldPackage.devVersion = commits.toString();
logger.log(`计算出devVersion为${commits}`);
fs.writeFileSync("package.json", JSON.stringify(oldPackage, null, 4));