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
    createElement,
    useContext,
    useReducer,
    Dispatch
} from 'react';
import {
    ThemeProvider,
    createTheme
} from "@mui/material/styles";
import LpLogger from "lp-logger";
import {
    setState
} from "declare";
export const logger = new LpLogger({
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
} from "components/window/Window";
import useStoragedState from "useStoragedState";
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
import WindowContainer from "./WindowContainer"; // 重的Window已经被动态加载，那么WindowContainer是轻的
import {
    drawerWidth
} from "setting/consts";
import useLang from "./useLang";
import registerProtocolHandler from "./registerProtocolHandler";
import registerServiceWorker from "./registerServiceWorker";
import desktopAdder from "./desktopAdder";
import defaultPalette from 'setting/theme/defaultPalette';
import {
    lists as listsType
} from "index/Sidebar";
import Ubuntu from "components/fonts";
import {
    viewMode as viewModeType
} from "index/consts";
import {
    SWRConfig
} from "swr";
import {
    single
} from "db";
import useExtensions, {
    extensionsDispatch
} from "./useExtensions";
import composeProviders from "./providerCompose";
import {
    repoInfo as repoInfoType
 } from "components/getRepoInfo";
export const showSidebar = createContext<{
    show: boolean;
    set: Dispatch<boolean>;
}>(null);
export type sidebarMode = "menu" | "sidebar";
export const sidebarMode = createContext<{
    value: sidebarMode;
    set: Dispatch<sidebarMode>;
}>(null);
export const forkMeOnGitHub = createContext<{
    value: boolean;
    set: Dispatch<boolean>;
}>(null);
export const share = createContext<{
    value: boolean;
    set: Dispatch<boolean>;
}>(null);
export const first = createContext<{
    value: boolean;
    set: Dispatch<boolean>;
}>(null);
export const paletteColors = createContext<{
    value: typeof defaultPalette;
    set: Dispatch<typeof defaultPalette>;
}>(null);
export const viewMode = createContext<{
    value: viewModeType;
    set: Dispatch<viewModeType>;
}>(null);
export const darkMode = createContext<{
    mode: PaletteMode | "system";
    set: Dispatch<PaletteMode | "system">;
}>(null);
export function useLightMode() {
    const gotContext = useContext(darkMode).mode;
    let value = true;
    switch (gotContext) {
        case "dark":
            value = false;
            break;
        case "system":
            if (isBrowser()) {
                value = !(window.matchMedia('(prefers-color-scheme: dark)').matches);
            }
            break;
    }
    return value;
}
export const colorMode = createContext<{
    value: boolean;
    set: Dispatch<boolean>;
}>(null);
export const lang = createContext<{
    value: string;
    set: Dispatch<string>;
}>(null);
export const recentlyUsed = createContext<{
    value: string[];
    set: Dispatch<string[]>;
}>(null);
export const lists = createContext<{
    value: listsType;
    set: Dispatch<listsType>;
}>(null);
export interface mostUsedMarks {
    [key: string]: number;
}
export const mostUsed = createContext<{
    value: mostUsedMarks;
    set: Dispatch<mostUsedMarks>;
}>(null);
export const windows = createContext<{
    windows: WindowOptions[];
    set: setState<WindowOptions[]>;
}>(null);
export const extensions = createContext<{
    value: single[];
    set: Dispatch<extensionsDispatch>;
}>(null);
export const repoInfo = createContext<repoInfoType>(null);
export default function ModifiedApp(props: {
    children: ReactNode;
    repoInfo: repoInfoType;
}) {
    const [mode, setMode] = useStoragedState<PaletteMode | "system">("darkmode", "暗色模式", "system"),
        [realWindows, setRealWindows] = useState<WindowOptions[]>([]),
        [palette, setPalette] = useStoragedState<typeof defaultPalette>("palette", "调色板", defaultPalette),
        [recentlyUsedState, setRecentlyUsed] = useStoragedState<string[]>("recently-tools", "最近使用的工具", []),
        [mostUsedState, setMostUsed] = useStoragedState<mostUsedMarks>("most-tools", "最常使用的工具", {}),
        [extensionsState, setExtensions] = useExtensions(),
        theme = useMemo(
            () => createTheme({
                palette: {
                    ...palette,
                    mode: mode === "system" ? (isBrowser() ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light") : "light") : mode,
                },
                typography: {
                    fontFamily: Ubuntu.style.fontFamily
                }
            }),
            [mode, palette]
        ),
        pathname = usePathname(),
        params = useSearchParams(),
        [choosedLang, setChoosedLang] = useLang(),
        [initDone, setInitDone] = useState<boolean>(false),
        [expand, setExpand] = useState<boolean>(false),
        [firstState, setFirst] = useStoragedState<boolean>("first", "第一次使用", true),
        [sidebarModeState, setSidebarMode] = useStoragedState<sidebarMode>("sidebarmode", "边栏模式", "menu"),
        [showSidebarState, setShowSidebar] = useStoragedState<boolean>("sidebar", "边栏", false),
        [listsState, setLists] = useStoragedState<listsType>("lists", "分类列表", []),
        [viewModeState, setViewMode] = useStoragedState<viewModeType>("viewmode", "列表模式", "list"),
        implant = (pathname === "/") || (params.get("only") === "true"),
        ml: string = implant ? "" : (expand ? `calc(min(${`calc(100vw - ${drawerWidth}px)`}, 320px) + ${drawerWidth}px)` : `${drawerWidth}px`),
        Sidebar = implant ? null : (sidebarModeState === "menu" ? createElement(dynamic(() => import("./Menu"))) : createElement(dynamic(() => import("page")), {
            isImplant: true,
            expand: expand,
            setExpand: setExpand
        })), // 使用createElement因为dynamic不能直接以JSX方式调用
        [forkMeOnGitHubState, setForkMeOnGithub] = useStoragedState<boolean>("fork-me-on-github", "Fork me on GitHub", false),
        [shareState, setShare] = useStoragedState<boolean>("share", "分享", isBrowser() ? "share" in navigator : false),
        [colorModeState, setColorModeState] = useStoragedState<boolean>("color", "多彩主页", true),
        Provider = composeProviders([repoInfo, props.repoInfo],[first, {
            value: firstState,
            set: setFirst
        }], [forkMeOnGitHub, {
            value: forkMeOnGitHubState,
            set: setForkMeOnGithub
        }], [showSidebar, {
            show: showSidebarState,
            set: setShowSidebar
        }], [darkMode, {
            mode: mode,
            set: setMode
        }], [colorMode, {
            value: colorModeState,
            set: setColorModeState
        }], [lang, {
            value: choosedLang,
            set: setChoosedLang
        }], [share, {
            value: shareState,
            set: setShare
        }], [lists, {
            value: listsState,
            set: setLists
        }], [sidebarMode, {
            value: sidebarModeState,
            set: setSidebarMode
        }], [paletteColors, {
            value: palette,
            set: setPalette
        }], [viewMode, {
            value: viewModeState,
            set: setViewMode
        }], [extensions, {
            value: extensionsState,
            set: setExtensions
        }], [windows, {
            windows: realWindows,
            set: setRealWindows
        }], [recentlyUsed, {
            value: recentlyUsedState,
            set: setRecentlyUsed
        }], [mostUsed, {
            value: mostUsedState,
            set: setMostUsed
        }]);
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
        <Provider>
            <ThemeProvider theme={theme}>
                <SWRConfig value={{
                    suspense: true
                }}>
                    <CssBaseline />
                    <Box component="aside">
                        {Sidebar}
                    </Box>
                    <Box component="main" ml={(showSidebarState && sidebarModeState === "sidebar") && ml}>
                        {props.children}
                    </Box>
                    <WindowContainer />
                </SWRConfig>
            </ThemeProvider>
        </Provider>
    );
}