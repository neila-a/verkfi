import {
    logger
} from "../layoutClient";
const registerServiceWorker = async () => {
    if ("serviceWorker" in window.navigator) {
        try {
            // register service worker
            const registration = await window.navigator.serviceWorker.register("/service-worker.js");
            logger.log(`Service worker注册完成：`, registration);
        } catch (reason) {
            logger.error("Service worker注册失败：", reason);
        }
    } else {
        logger.warn("此设备没有ServiceWorker");
    }
};
export default registerServiceWorker;
