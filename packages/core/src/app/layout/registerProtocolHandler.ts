"use client";
import {
    logger
} from "./layoutClient";
const registerProtocolHandler = () => {
    const url = `${location.origin}/handle?handle=%s`;
    if ("registerProtocolHandler" in window.navigator) {
        logger.log("检测到此设备可以注册协议");
        window.navigator.registerProtocolHandler("web+verkfi", url);
    } else {
        logger.warn("检测到此设备无法注册协议");
    }
};
export default registerProtocolHandler;
