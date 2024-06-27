import {
    BuildOptions,
    Message,
    build
} from "esbuild";
import {
    logger
} from "./consts";
export default async function logbuild(options: BuildOptions, filename: string) {
    const awaitedResult = await build(options);
    logger.log(`正在编译${filename}……`);
    const log = (message: [Message[], string]) => {
        if (message[0].length === 0) {
            logger.log(`编译${filename}时未出现${message[1]}。`);
        } else {
            message[0].forEach(warn => logger.warn(`编译${filename}时出现${message[1]}：${JSON.stringify(warn)}`));
        }
    };
    log([awaitedResult.errors, "错误"]);
    log([awaitedResult.warnings, "警告"]);
    return awaitedResult;
}
