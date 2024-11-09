import {
    logger
} from "../layoutClient";
// import ServiceWorker from "@verkfi/core-service-worker/index?worker&url"
const registerServiceWorker = async () => {
    if ("serviceWorker" in window.navigator) {
        try {
            // register service worker
            //const registration = await window.navigator.serviceWorker.register(ServiceWorker);
            //logger.log(`Service worker注册完成：`, registration);
        } catch (reason) {
            logger.error("Service worker注册失败：", reason);
        }
    } else {
        logger.warn("此设备没有ServiceWorker");
    }
};
export default registerServiceWorker;
