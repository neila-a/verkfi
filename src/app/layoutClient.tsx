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
    ReactNode,
    useRef,
    useReducer
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
import useStoragedState from "./components/useStoragedState";
import {
    PaletteMode
} from "@mui/material";
import {
    usePathname,
    useSearchParams
} from "next/navigation";
import Index from "./page";
import {
    drawerWidth
} from "./setting/consts";
import stringToBoolean from "./setting/stringToBoolean";
import { stringifyCheck } from "./setting/Switcher";
import setSetting from "./setting/setSetting";
import Menu from "./Menu";
export const windows = createContext<{
    windows: WindowOptions[];
    set: setState<WindowOptions[]>;
}>(null);
export function WindowsProvider(props: {
    children: ReactNode;
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
export const showSidebar = createContext<{
    show: stringifyCheck;
    set: setState<stringifyCheck>;
}>(null);
export type sidebarMode = "menu" | "sidebar";
export const sidebarMode = createContext<{
    value: sidebarMode;
    set: setState<sidebarMode>;
}>(null);
export const forkMeOnGitHub = createContext<{
    value: stringifyCheck;
    set: setState<stringifyCheck>;
}>(null);
export const darkMode = createContext<{
    mode: PaletteMode;
    set: setState<PaletteMode>;
}>(null);
export const colorMode = createContext<{
    value: stringifyCheck;
    set: setState<stringifyCheck>;
}>(null);
export const lang = createContext<{
    value: string;
    set: setState<string>;
}>(null);
export const useLang = () => {
    var browserLang: string = "zhCN";
    if (isBrowser()) {
        if (window.navigator.language || window.navigator.languages) {
            browserLang = ((window.navigator.languages && window.navigator.languages[0]) || window.navigator.language).split("-").join("") || "zhCN";
        }
    }
    const detailedLang = Object.keys(locales).includes(browserLang) ? browserLang : "zhCN",
        choose = checkOption("lang", "语言", detailedLang),
        real = choose || "zhCN";
    return useReducer((old: string, val: string) => {
        intl.init({
            currentLocale: val,
            locales
        });
        setSetting("lang", "语言", val);
        return val;
    }, real);
};
export default function ModifiedApp(props: {
    children: ReactNode
}) {
    const [mode, setMode] = useStoragedState<PaletteMode>("darkmode", "暗色模式", "light"),
        theme = useMemo(
            () =>
                createTheme({
                    palette: {
                        mode,
                    },
                }),
            [mode]
        ),
        pathname = usePathname(),
        params = useSearchParams(),
        indexRef = useRef(null),
        [choosedLang, setChoosedLang] = useLang();
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
                await intl.init({
                    currentLocale: choosedLang,
                    locales
                });
                setInitDone(true);
                logger.log("语言已经加载完毕");
            }
        }
        loadLang();
        return () => {
            isMounted = false;
        }
    }, []);
    var [expand, setExpand] = useState<boolean>(false),
        [sidebarModeState, setSidebarMode] = useStoragedState<sidebarMode>("sidebarmode", "边栏模式", "menu"),
        [showSidebarState, setShowSidebar] = useStoragedState<stringifyCheck>("sidebar", "边栏", "false");
    const implant = (pathname === "/") || (params.get("only") === "true"),
        marginLeft: string = implant ? "" : (expand ? `calc(min(${`calc(100vw - ${drawerWidth}px)`}, 320px) + ${drawerWidth}px)` : `${drawerWidth}px`),
        Sidebar = implant ? null : (sidebarModeState === "menu" ? <Menu /> : (showSidebarState && <Index isImplant expand={expand} setExpand={setExpand} />)),
        [forkMeOnGitHubState, setForkMeOnGithub] = useStoragedState<stringifyCheck>("fork-me-on-github", "Fork me on GitHub", "false"),
        [colorModeState, setColorModeState] = useStoragedState<stringifyCheck>("color", "多彩主页", "true");
    return initDone && (
        <div style={{
            backgroundColor: theme.palette.mode === "dark" ? "#000000" : "#ffffff"
        }}>
            <ThemeProvider theme={theme}>
                <showSidebar.Provider value={{
                    show: showSidebarState,
                    set: setShowSidebar
                }}>
                    <forkMeOnGitHub.Provider value={{
                        value: forkMeOnGitHubState,
                        set: setForkMeOnGithub
                    }}>
                        <darkMode.Provider value={{
                            mode: mode,
                            set: setMode
                        }}>
                            <colorMode.Provider value={{
                                value: colorModeState,
                                set: setColorModeState
                            }}>
                                <lang.Provider value={{
                                    value: choosedLang,
                                    set: setChoosedLang
                                }}>
                                    <sidebarMode.Provider value={{
                                        value: sidebarModeState,
                                        set: setSidebarMode
                                    }}>
                                        {Sidebar}
                                        <div style={{
                                            marginLeft: (stringToBoolean(showSidebarState) && sidebarModeState === "sidebar") ? marginLeft : ""
                                        }}>
                                            {props.children}
                                        </div>
                                        <WindowContainer />
                                    </sidebarMode.Provider>
                                </lang.Provider>
                            </colorMode.Provider>
                        </darkMode.Provider>
                    </forkMeOnGitHub.Provider>
                </showSidebar.Provider>
            </ThemeProvider>
        </div>
    );
}