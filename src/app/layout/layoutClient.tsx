"use client";
import enUS from "../locales/en-US.json";
import zhCN from "../locales/zh-CN.json";
import zhTW from "../locales/zh-TW.json";
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
    createElement
} from 'react';
import {
    ThemeProvider,
    createTheme
} from "@mui/material/styles";
import LpLogger from "lp-logger";
import {
    setState
} from "../declare";
export var logger = new LpLogger({
    name: "Verkfi",
    level: "log", // 空字符串时，不显示任何信息
});
export type colorMode = 'light' | 'dark';
export const isBrowser = () => typeof window !== 'undefined'; // The approach recommended by Next.js
import {
    createContext
} from "react";
import {
    WindowOptions
} from "../components/window/Window";
import useStoragedState from "../components/useStoragedState";
import {
    Box,
    CssBaseline,
    PaletteMode
} from "@mui/material";
import {
    usePathname,
    useSearchParams
} from "next/navigation";
import dynamic from "next/dynamic";
import WindowContainer from "../WindowContainer"; // 重的Window已经被动态加载，那么WindowContainer是轻的
import {
    drawerWidth
} from "../setting/consts";
import stringToBoolean from "../setting/stringToBoolean";
import {
    stringifyCheck
} from "../setting/Switcher";
import useLang from "./useLang";
import registerProtocolHandler from "./registerProtocolHandler";
import registerServiceWorker from "./registerServiceWorker";
import desktopAdder from "./desktopAdder";
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
export const share = createContext<{
    value: stringifyCheck;
    set: setState<stringifyCheck>;
}>(null);
export const first = createContext<{
    value: stringifyCheck;
    set: setState<stringifyCheck>;
}>(null);
export const paletteColors = createContext<{
    value: string;
    set: setState<string>;
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
export const recentlyUsed = createContext<{
    value: string;
    set: setState<string>;
}>(null);
export const mostUsed = createContext<{
    value: string;
    set: setState<string>;
}>(null);
export const windows = createContext<{
    windows: WindowOptions[];
    set: setState<WindowOptions[]>;
}>(null);
export function WindowsProvider(props: {
    children: ReactNode;
}) {
    const [realWindows, setRealWindows] = useState<WindowOptions[]>([]);
    return (
        <windows.Provider value={{
            windows: realWindows,
            set: setRealWindows
        }}>
            {props.children}
        </windows.Provider>
    );
}
export default function ModifiedApp(props: {
    children: ReactNode
}) {
    const [mode, setMode] = useStoragedState<PaletteMode>("darkmode", "暗色模式", "light"),
        [palette, setPalette] = useStoragedState<string>("palette", "调色板", "__none__"),
        [recentlyUsedState, setRecentlyUsed] = useStoragedState<string>("recently-tools", "最近使用的工具", "[]"),
        [mostUsedState, setMostUsed] = useStoragedState<string>("most-tools", "最常使用的工具", "{}"),
        realPalette = useMemo(() => (palette === "__none__" ? {} : JSON.parse(palette)), [palette]),
        theme = useMemo(
            () =>
                createTheme({
                    palette: {
                        ...realPalette,
                        mode,
                    },
                    typography: {
                        fontFamily: [
                            "Ubuntu",
                            "Roboto",
                            "Helvetica",
                            "Arial",
                            "sans-serif"
                        ].join(",")
                    }
                }),
            [mode, palette]
        ),
        pathname = usePathname(),
        params = useSearchParams(),
        [choosedLang, setChoosedLang] = useLang(),
        [initDone, setInitDone] = useState<boolean>(false),
        [expand, setExpand] = useState<boolean>(false),
        [firstState, setFirst] = useStoragedState<stringifyCheck>("first", "第一次使用", "true"),
        [sidebarModeState, setSidebarMode] = useStoragedState<sidebarMode>("sidebarmode", "边栏模式", "menu"),
        [showSidebarState, setShowSidebar] = useStoragedState<stringifyCheck>("sidebar", "边栏", "false"),
        implant = (pathname === "/") || (params.get("only") === "true"),
        ml: string = implant ? "" : (expand ? `calc(min(${`calc(100vw - ${drawerWidth}px)`}, 320px) + ${drawerWidth}px)` : `${drawerWidth}px`),
        Sidebar = implant ? null : (sidebarModeState === "menu" ? createElement(dynamic(() => import("../Menu"))) : createElement(dynamic(() => import("../page")), {
            isImplant: true,
            expand: expand,
            setExpand: setExpand
        })), // 使用createElement因为dynamic不能直接以JSX方式调用
        [forkMeOnGitHubState, setForkMeOnGithub] = useStoragedState<stringifyCheck>("fork-me-on-github", "Fork me on GitHub", "false"),
        [shareState, setShare] = useStoragedState<stringifyCheck>("share", "分享", isBrowser() ? String("share" in navigator) as stringifyCheck : "false"),
        [colorModeState, setColorModeState] = useStoragedState<stringifyCheck>("color", "多彩主页", "true");
    useEffect(() => {
        if (isBrowser()) {
            registerProtocolHandler();
            registerServiceWorker();
        } else {
            logger.error(`执行BOM相关操作时发生错误`);
        }
        desktopAdder();
        let isMounted = true;
        async function loadLang() {
            if (isMounted) {
                try {
                    await intl.init({
                        currentLocale: choosedLang,
                        locales
                    });
                } catch (error) {
                    logger.error("语言加载出现错误：", error);
                }
                setInitDone(true);
                logger.log("语言已经加载完毕");
            }
        }
        loadLang();
        return () => {
            isMounted = false;
        }
    }, []);
    return initDone && (
        <first.Provider value={{
            value: firstState,
            set: setFirst
        }}>
            <forkMeOnGitHub.Provider value={{
                value: forkMeOnGitHubState,
                set: setForkMeOnGithub
            }}>
                <ThemeProvider theme={theme}>
                    <showSidebar.Provider value={{
                        show: showSidebarState,
                        set: setShowSidebar
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
                                    <share.Provider value={{
                                        value: shareState,
                                        set: setShare
                                    }}>
                                        <sidebarMode.Provider value={{
                                            value: sidebarModeState,
                                            set: setSidebarMode
                                        }}>
                                            <paletteColors.Provider value={{
                                                value: palette,
                                                set: setPalette
                                            }}>
                                                <recentlyUsed.Provider value={{
                                                    value: recentlyUsedState,
                                                    set: setRecentlyUsed
                                                }}>
                                                    <mostUsed.Provider value={{
                                                        value: mostUsedState,
                                                        set: setMostUsed
                                                    }}>
                                                        <CssBaseline />
                                                        <Box component="aside">
                                                            {Sidebar}
                                                        </Box>
                                                        <Box component="main" ml={(stringToBoolean(showSidebarState) && sidebarModeState === "sidebar") && ml}>
                                                            {props.children}
                                                        </Box>
                                                        <WindowContainer />
                                                    </mostUsed.Provider>
                                                </recentlyUsed.Provider>
                                            </paletteColors.Provider>
                                        </sidebarMode.Provider>
                                    </share.Provider>
                                </lang.Provider>
                            </colorMode.Provider>
                        </darkMode.Provider>
                    </showSidebar.Provider>
                </ThemeProvider>
            </forkMeOnGitHub.Provider>
        </first.Provider>
    );
}