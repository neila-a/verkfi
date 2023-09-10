"use client";
import enUS from "./locales/en-US.json";
import zhCN from "./locales/zh-CN.json";
import zhTW from "./locales/zh-TW.json";
export const locales = {
    enUS,
    zhCN,
    zhTW
};
import intl from 'react-intl-universal';
import {
    useEffect,
    useState,
    useMemo,
    ReactNode
} from 'react';
import {
    ThemeProvider,
    createTheme
} from "@mui/material/styles"
import LpLogger from "lp-logger";
import {
    BeforeInstallPromptEvent, setState
} from "./declare";
import checkOption from "./setting/checkOption";
var logger = new LpLogger({
    name: "NeilaTools",
    level: "log", // 空字符串时，不显示任何信息
});
export type colorMode = 'light' | 'dark';
export const isBrowser = () => typeof window !== 'undefined'; // The approach recommended by Next.js
import WindowContainer from "./WindowContainer";
import {
    createContext
} from "react";
import {
    WindowOptions
} from "./components/window/Window";
export const windows = createContext<{
    windows: WindowOptions[];
    set: setState<WindowOptions[]>;
}>(null);
export function WindowsProvider(props: {
    children: ReactNode
}) {
    var [realWindows, setRealWindows] = useState<WindowOptions[]>([]);
    return (
        <windows.Provider value={{
            windows: realWindows,
            set: setRealWindows
        }}>
            {props.children}
        </windows.Provider>
    );
}
export default function ModifiedApp(props) {
    const [mode, setMode] = useState<colorMode>(() => {
        const mightMode = checkOption("darkmode", "暗色模式", "false");
        var realMode: colorMode;
        if (typeof mightMode == "string") {
            realMode = mightMode.replace("false", "light").replace("true", "dark") as colorMode;
        } else {
            realMode = "light";
        }
        return realMode || "light";
    }),
        theme = useMemo(
            () =>
                createTheme({
                    palette: {
                        mode,
                    },
                }),
            [mode]
        ),
        [choosedLang, setChoosedLang] = useState<string>(() => {
            var browserLang: string = "zhCN";
            if (isBrowser()) {
                if (window.navigator.language || window.navigator.languages) {
                    browserLang = ((window.navigator.languages && window.navigator.languages[0]) || window.navigator.language).split("-").join("") || "zhCN";
                }
            }
            const detailedLang = Object.keys(locales).includes(browserLang) ? browserLang : "zhCN",
                choose = checkOption("lang", "语言", detailedLang);
            return choose || "zhCN";
        });
    var [initDone, setInitDone] = useState<boolean>(false);
    useEffect(() => {
        var url = `${location.origin}/handle?handle=%s`;
        if (isBrowser()) {
            if ("registerProtocolHandler" in window.navigator) {
                logger.log("检测到此设备可以注册协议");
                window.navigator.registerProtocolHandler("web+neilatools", url);
            } else {
                logger.warn("检测到此设备无法注册协议");
            }
            if ('serviceWorker' in window.navigator) {
                // register service worker
                window.navigator.serviceWorker.register("/service-worker.js").then(registration => {
                    logger.log(`Service worker for UWA register success:`, registration)
                }).catch(reason => {
                    logger.error(`Service worker for UWA register fail: ${reason}`)
                });
            } else {
                logger.warn("此设备没有ServiceWorker");
            }
        } else {
            logger.error(`执行BOM相关操作时发生错误`);
        }
        var deferredPrompt: BeforeInstallPromptEvent;
        // 监听beforeinstallprompt事件，该事件在网站满足PWA安装条件时触发，保存安装事件
        window.addEventListener("beforeinstallprompt", (event: BeforeInstallPromptEvent) => {
            event.preventDefault();
            deferredPrompt = event;
        });
        // 监听appinstalled事件，该事件在用户同意安装后触发，清空安装事件
        window.addEventListener("appinstalled", () => {
            deferredPrompt = null;
        });
        // 手动触发PWA安装
        const addToDesktop = () => deferredPrompt.prompt();
        window.installPWA = addToDesktop;
        let isMounted = true;
        async function loadLang() {
            if (isMounted) {
                const result = await intl.init({
                    currentLocale: choosedLang,
                    locales
                });
                setInitDone(true);
                logger.log("语言已经加载完毕");
                return result;
            }
        }
        loadLang();
        return () => {
            isMounted = false;
        }
    }, []);
    return initDone && (
        <div style={{
            backgroundColor: theme.palette.mode === "dark" ? "#000000" : "#ffffff"
        }}>
            <ThemeProvider theme={theme}>
                {props.children}
                <WindowContainer />
            </ThemeProvider>
        </div>
    );
}