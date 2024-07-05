import {
    BuildOptions,
    Message,
    build
} from "esbuild";
import "@colors/colors";
export default async function logbuild(options: BuildOptions, filename: string) {
    const time = `${`编译${filename}`.brightCyan}  耗时`;
    console.time(time);
    const awaitedResult = await build(options);
    console.log(`编译${filename}`.brightCyan, ` 正在编译${filename}……`);
    const log = (...message: [Message[], string]) => {
        if (message[0].length === 0) {
            console.log(`编译${filename}`.brightCyan, ` 编译${filename}时未出现${message[1]}。`);
        } else {
            message[0].forEach(warn => console.log(`编译${filename}`.brightYellow, ` 编译${filename}时出现${message[1]}：${JSON.stringify(warn)}`));
        }
    };
    log(awaitedResult.errors, "错误");
    log(awaitedResult.warnings, "警告");
    console.timeEnd(time);
    console.log(""); // 换行
    return awaitedResult;
}
