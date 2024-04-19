/**
 * This is a dev-tool only, not for prodcution!
 */
import {
    getRepoInfo
} from "components/getRepoInfo";
import {
    BuildResult,
    Message,
    build
} from "esbuild";
import Logger from "lp-logger";
import type {
    Manifest
} from "next/dist/lib/metadata/types/manifest-types";
import ChildProcess from "node:child_process";
import * as fs from "node:fs";
import pack from "./package.json";
const logger = new Logger({
    name: "prebuild",
    level: "log"
});
async function devMain() {
    const repoInfo = await getRepoInfo();
    let commits = Number(ChildProcess.execSync("git log --oneline | wc -l").toString().replace(/\n/g, ""));
    const oldPackage = <typeof pack>JSON.parse(fs.readFileSync("package.json").toString());
    commits++;
    oldPackage.description = repoInfo.description;
    oldPackage.devVersion = commits.toString();
    logger.log(`计算出devVersion为${commits}`);
    fs.writeFileSync("package.json", JSON.stringify(oldPackage, null, 4));
    const oldManifest = <Manifest>JSON.parse(fs.readFileSync("public/index.webmanifest").toString());
    oldManifest.description = repoInfo.description;
    oldManifest.short_name = repoInfo.name;
    oldManifest.name = repoInfo.name;
    oldManifest.id = pack.name;
    fs.writeFileSync("public/index.webmanifest", JSON.stringify(oldManifest, null, 4));
    return [oldPackage, oldManifest];
}
async function publicMain() {
    const pages = ChildProcess.execSync(`find ./src/app -name '*page.tsx'`).toString().replaceAll("./src/app", "").replaceAll("page.tsx", "").split("\n");
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
    const pagesJSON = JSON.stringify(pages, null, 4);
    fs.writeFileSync("./src/app/pages.json", pagesJSON);
    const logbuild: <BuildOptions>(result: BuildResult<BuildOptions>, filename: string) => void = (result, filename) => {
        logger.log(`正在编译${filename}……`);
        const log = (message: [Message[], string]) => {
            if (message[0].length === 0) {
                logger.log(`编译${filename}时未出现${message[1]}。`);
            } else {
                message[0].forEach(warn => logger.warn(`编译${filename}时出现${message[1]}：${JSON.stringify(warn)}`));
            }
        };
        log([result.errors, "错误"]);
        log([result.warnings, "警告"]);
    },
        NextConfig = await build({
            entryPoints: ["next.config.ts"],
            outfile: "next.config.js",
            bundle: true,
            minify: true,
            platform: "node"
        }),
        ServiceWorker = await build({
            entryPoints: ["./src/app/service-worker.ts"],
            outfile: "public/service-worker.js",
            bundle: true,
            minify: true
        });
    logbuild(NextConfig, "next.config.ts");
    logbuild(ServiceWorker, "service-worker.ts");
    return pagesJSON;
}
if (process.env.VERKFI_ENV === "dev") {
    devMain();
}
publicMain();
// 并发执行