"use client";
export default async function openWindow(src: string) {
    // @ts-ignore TSdk 的 API 更新得太慢，这里还没写，实际生产环境是可以运行的
    const opened = await (window.documentPictureInPicture.requestWindow as () => Promise<Window>)();
    const element = opened.document.createElement("iframe");
    element.src = src;
    element.style.border = "none";
    element.style.height = element.style.width = "100%";
    opened.document.body.appendChild(element);
    opened.addEventListener("pagehide", event => {
    });
    return opened;
}
