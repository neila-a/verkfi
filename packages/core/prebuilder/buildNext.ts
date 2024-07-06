import getNextProcess from "./getNextProcess";
import "@colors/colors";
export default function buildNext() {
    console.time("编译Verkfi耗时".brightCyan);
    console.log("开始编译Verkfi".brightCyan);
    const next = getNextProcess();
    next.stdout?.on("data", chunk => {
        process.stdout.write(String(chunk).brightBlue);
    }).on("close", () => {
        console.log("编译Verkfi成功完成".brightCyan);
        console.timeEnd("编译Verkfi耗时".brightCyan);
    });
    next.stderr?.on("data", chunk => {
        process.stderr.write(String(chunk).brightRed);
    }).on("close", () => {
        console.error("编译Verkfi以错误退出".brightRed);
    });
}
