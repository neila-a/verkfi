/**
 * This is a dev-tool only, not for prodcution!
 */
import editDevVersion from "./editDevVersion";
import editPages from "./editPages";
import buildServiceWorker from "./buildServiceWorker";
import buildNextConfig from "./buildNextConfig";
if (process.env.VERKFI_ENV === "dev") {
    editDevVersion();
}
editPages();
buildServiceWorker();
buildNextConfig();
// 并发执行
