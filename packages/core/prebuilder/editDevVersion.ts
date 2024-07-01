import getRepoInfo from "@verkfi/shared/getRepoInfo";
import {
    exec
} from "node:child_process";
import type pack from "../../../package.json";
import {
    JSONspacing
} from "./consts";
import {
    readFile,
    writeFile
} from "node:fs/promises";
import {
    promisify
} from "node:util";
import "@colors/colors";
export default async function editDevVersion() {
    const repoInfo = await getRepoInfo(),
        file = await readFile("./package.json"),
        oldPackage = <typeof pack>JSON.parse(file.toString()),
        {
            stdout
        } = await promisify(exec)("git log --oneline | wc -l"),
        commits = Number(stdout.replace(/\n/g, "")) + 1;
    oldPackage.description = repoInfo.description;
    oldPackage.devVersion = commits.toString();
    console.log("计算devVersion".brightCyan, ` 计算出devVersion为${commits}\n`);
    await writeFile("./package.json", JSON.stringify(oldPackage, null, JSONspacing));
    return oldPackage;
}
