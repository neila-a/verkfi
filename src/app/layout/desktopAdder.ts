"use client";
import {
    BeforeInstallPromptEvent
} from "../declare";
import {
    logger
} from "./layoutClient";
const desktopAdder = () => {
    const defaultPrompt = {
        prompt() {
            logger.error("无法安装");
        },
    };
    //@ts-ignore 不是，你不能安装PWA还强行安装，指定没好果汁吃奥
    var deferredPrompt: BeforeInstallPromptEvent = defaultPrompt;
    // 监听beforeinstallprompt事件，该事件在网站满足PWA安装条件时触发，保存安装事件
    window.addEventListener("beforeinstallprompt", (event: BeforeInstallPromptEvent) => {
        event.preventDefault();
        deferredPrompt = event;
    });
    // 监听appinstalled事件，该事件在用户同意安装后触发，清空安装事件
    window.addEventListener("appinstalled", () => {
        //@ts-ignore 不是，你安装完了还想安装，指定没好果汁吃奥
        deferredPrompt = defaultPrompt;
    });
    // 手动触发PWA安装
    const addToDesktop = () => deferredPrompt.prompt();
    window.installPWA = addToDesktop;
};
export default desktopAdder;