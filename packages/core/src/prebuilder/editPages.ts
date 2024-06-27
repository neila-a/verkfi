import ChildProcess from "node:child_process";
import * as fs from "node:fs";
import {
    JSONspacing
} from "./consts";
export default function editPages() {
    const
        pages = ChildProcess
            .execSync(`find ./src/app -name '*page.tsx'`)
            .toString()
            .replaceAll("./src/app", "")
            .replaceAll("page.tsx", "")
            .split("\n")
            .map(single => {
                if (single !== "/") {
                    return single.substr(0, single.length - 1);
                }
                return "/";
            }).filter(single => single !== ""), pagesJSON = JSON.stringify(pages, null, JSONspacing);
    return fs.writeFileSync("./src/pages.json", pagesJSON);
}
