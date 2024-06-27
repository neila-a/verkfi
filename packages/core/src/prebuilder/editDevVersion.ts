import getRepoInfo from "@verkfi/shared/getRepoInfo";
import ChildProcess from "node:child_process";
import * as fs from "node:fs";
import pack from "../../package.json";
import {
    logger,
    JSONspacing
} from "./consts";
export default async function editDevVersion() {
    const repoInfo = await getRepoInfo();
    let commits = Number(ChildProcess.execSync("git log --oneline | wc -l").toString().replace(/\n/g, ""));
    const oldPackage = <typeof pack>JSON.parse(fs.readFileSync("package.json").toString());
    commits++;
    oldPackage.description = repoInfo.description;
    oldPackage.devVersion = commits.toString();
    logger.log(`计算出devVersion为${commits}`);
    fs.writeFileSync("package.json", JSON.stringify(oldPackage, null, JSONspacing));
    return oldPackage;
}
