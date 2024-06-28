/**
 * This is a dev-tool only, not for prodcution!
 */
import editDevVersion from "./editDevVersion";
import editPages from "./editPages";
import buildServiceWorker from "./buildServiceWorker";
import buildNextConfig from "./buildNextConfig";
import buildNext from "./buildNext";
(async () => {
    if (process.env.VERKFI_ENV === "dev") {
        await editDevVersion();
    }
    await editPages();
    await buildServiceWorker();
    await buildNextConfig();
    buildNext();
})();
