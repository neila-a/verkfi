import {
    ChildProcess,
    exec
} from "node:child_process";
const nextPath = "./node_modules/.bin/next ",
    dir = "./packages/core/ui";
export default function getNextProcess() {
    let next: ChildProcess;
    if (process.env.VERKFI_ENV === "dev") {
        next = exec(`VERKFI_URL=localhost:3000 ${nextPath}dev ${dir} --turbo`);
    } else {
        next = exec(`${nextPath} build ${dir}`);
    }
    return next;
}
