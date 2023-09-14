/**
 * This is a dev-tool only, not for prodcution!
 */
import * as fs from "node:fs";
import pack from "./package.json";
import ChildProcess from "node:child_process";
import {
    getRepoInfo
} from "./src/app/components/getRepoInfo";
const logger = new Logger({
    name: "ModifyPackage",
    level: "log"
});
import Logger from "lp-logger";
async function main() {
    const repoInfo = await getRepoInfo();
    let commits = Number(ChildProcess.execSync("git log --oneline | wc -l").toString().replace(/\n/g, "")),
        oldPackage = <typeof pack>JSON.parse(fs.readFileSync("package.json").toString());
    commits++;
    oldPackage.description = repoInfo.description;
    oldPackage.devVersion = commits.toString();
    logger.log(`计算出devVersion为${commits}`);
    fs.writeFileSync("package.json", JSON.stringify(oldPackage, null, 4));
    return oldPackage;
}
if (process.argv[2] === "dev") {
    main();
}
var pages = ChildProcess.execSync(`find ./src/app -name '*page.tsx'`).toString().replaceAll("./src/app", "").replaceAll("page.tsx", "").split("\n");
pages.forEach((single, index) => {
    if (single !== "/") {
        pages[index] = pages[index].substr(0, pages[index].length - 1);
    }
});
pages.forEach((single, index) => {
    if (single === "/handle") {
        pages.splice(index, 1);
    }
});
pages.forEach((single, index) => {
    if (single === "") {
        pages.splice(index, 1);
    }
});
fs.writeFileSync("src/app/pages.json", JSON.stringify(pages, null, 4));