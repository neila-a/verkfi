import {
    exec
} from "node:child_process";
import {
    JSONspacing
} from "./consts";
import {
    writeFile
} from "node:fs/promises";
import {
    promisify
} from "node:util";
export default async function editPages() {
    const
        {
            stdout
        } = await promisify(exec)("find ./src/app -name '*page.tsx'"),
        pages = stdout
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
    return await writeFile("./src/pages.json", pagesJSON);
}
