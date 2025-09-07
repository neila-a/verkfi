export const noInstallPWA = Symbol("noInstallPWA");
function desktopAdder() {
    let prompt: installPWA = noInstallPWA;
    // 监听beforeinstallprompt事件，该事件在网站满足PWA安装条件时触发，保存安装事件
    window.addEventListener("beforeinstallprompt", (event: BeforeInstallPromptEvent) => {
        event.preventDefault();
        prompt = event.prompt.bind(event);
    });
    // 监听appinstalled事件，该事件在用户同意安装后触发，清空安装事件
    window.addEventListener("appinstalled", () => {
        prompt = noInstallPWA;
    });
    // 手动触发PWA安装
    window.installPWA = prompt;
}
export default desktopAdder;
