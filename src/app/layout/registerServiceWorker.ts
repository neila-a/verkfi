"use client";
import {
    logger
} from "./layoutClient";
const registerServiceWorker = async () => {
    if ('serviceWorker' in window.navigator) {
        try {
            // register service worker
            const registration = await window.navigator.serviceWorker.register("/service-worker.js");
            logger.log(`Service worker for UWA register success:`, registration);
        } catch (reason) {
            logger.error(`Service worker for UWA register fail: ${reason}`);
        }
    } else {
        logger.warn("此设备没有ServiceWorker");
    }
};
export default registerServiceWorker;