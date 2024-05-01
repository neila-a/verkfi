"use client";
import {
    Box,
    CssBaseline,
    PaletteMode
} from "@mui/material";
import {
    ThemeProvider,
    createTheme
} from "@mui/material/styles";
import Ubuntu from "components/fonts";
import {
    repoInfo as repoInfoType
} from "components/getRepoInfo";
import {
    WindowOptions
} from "components/window/Window";
import {
    viewMode as viewModeType
} from "index/consts";
import {
    lists as listsType
} from "index/sidebar";
import {
    atom,
    useAtom
} from "jotai";
import LpLogger from "lp-logger";
import dynamic from "next/dynamic";
import {
    usePathname,
    useSearchParams
} from "next/navigation";
import {
    ReactNode,
    createContext,
    createElement,
    useEffect,
    useMemo,
    useState
} from "react";
import intl from "react-intl-universal";
import defaultPalette from "setting/appearance/defaultPalette";
import {
    drawerWidth
} from "setting/consts";
import atomWithStorage from "setting/reader/atomWithStorage";
import enUS from "../locales/en-US.json";
import zhCN from "../locales/zh-CN.json";
import zhTW from "../locales/zh-TW.json";
import WindowContainer from "./WindowContainer"; // 重的Window已经被动态加载，那么WindowContainer是轻的
import langAtom from "./langAtom";
import composeProviders from "./providerCompose";
import desktopAdder from "./registers/desktopAdder";
import registerProtocolHandler from "./registers/registerProtocolHandler";
import registerServiceWorker from "./registers/registerServiceWorker";
export const locales = {
    enUS,
    zhCN,
    zhTW
};
export const logger = new LpLogger({
    name: "Verkfi",
    level: "log" // 空字符串时，不显示任何信息
});
export type colorMode = "light" | "dark";
export const isBrowser = () => typeof window !== "undefined"; // The approach recommended by Next.js
export type sidebarMode = "menu" | "sidebar";
export interface mostUsedMarks {
    [key: string]: number;
}
export const sidebarMode = atomWithStorage<sidebarMode>("sidebarmode", "边栏模式", "menu"),
    showSidebar = atomWithStorage<boolean>("sidebar", "边栏", false),
    forkMeOnGitHub = atomWithStorage<boolean>("fork-me-on-github", "Fork me on GitHub", false),
    share = atomWithStorage<boolean>("share", "分享", isBrowser() ? "share" in navigator : false),
    paletteColors = atomWithStorage<typeof defaultPalette>("palette", "调色板", defaultPalette),
    viewMode = atomWithStorage<viewModeType>("viewmode", "列表模式", "list"),
    darkMode = atomWithStorage<PaletteMode | "system">("darkmode", "暗色模式", "system"),
    booleanifyDarkMode = atom(get => {
        const [gotAtom] = get(darkMode);
        let value = true;
        switch (gotAtom) {
            case "dark":
                value = false;
                break;
            case "system":
                if (isBrowser()) {
                    value = !(window.matchMedia("(prefers-color-scheme: dark)").matches);
                }
                break;
        }
        return value;
    }),
    gradientTool = atomWithStorage<boolean>("gradient-tool", "工具渐变", false),
    recentlyUsed = atomWithStorage<string[]>("recently-tools", "最近使用的工具", []),
    mostUsed = atomWithStorage<mostUsedMarks>("most-tools", "最常使用的工具", {
    }),
    lists = atomWithStorage<listsType>("lists", "分类列表", []),
    windows = atom<WindowOptions[]>([]);
export const repoInfo = createContext<repoInfoType>(null);
export default function ModifiedApp(props: {
    children: ReactNode;
    repoInfo: repoInfoType;
}) {
    const [mode] = useAtom(darkMode),
        [palette] = useAtom(paletteColors),
        theme = useMemo(
            () => createTheme({
                palette: {
                    ...palette,
                    mode: mode === "system" ? (isBrowser() ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : "light") : mode
                },
                typography: {
                    fontFamily: Ubuntu.style.fontFamily
                }
            }),
            [mode, palette]
        ),
        pathname = usePathname(),
        params = useSearchParams(),
        [choosedLang] = useAtom(langAtom),
        [initDone, setInitDone] = useState<boolean>(false),
        [expand, setExpand] = useState<boolean>(false),
        implant = (pathname === "/") || (params.get("only") === "true"),
        [sidebarModeValue] = useAtom(sidebarMode),
        ml: string = implant ? "" : (expand ? `calc(min(${`calc(100vw - ${drawerWidth}px)`}, 320px) + ${drawerWidth}px)` : `${drawerWidth}px`),
        Sidebar = implant ? null : (sidebarModeValue === "menu" ? createElement(dynamic(() => import("./Menu"))) : createElement(dynamic(() => import("page")), {
            isImplant: true,
            expand: expand,
            setExpand: setExpand
        })), // 使用createElement因为dynamic不能直接以JSX方式调用
        [showSidebarValue] = useAtom(showSidebar),
        Provider = composeProviders([repoInfo, props.repoInfo]);
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
        };
    }, []);
    return initDone && (
        <Provider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box component="aside">
                    {Sidebar}
                </Box>
                <Box component="main" ml={(showSidebarValue && sidebarModeValue === "sidebar") && ml}>
                    {props.children}
                </Box>
                <WindowContainer />
            </ThemeProvider>
        </Provider>
    );
}
