"use client";
import {
    Box,
    CssBaseline
} from "@mui/material";
import {
    ThemeProvider
} from "@mui/material/styles";
import {
    repoInfo as repoInfoType
} from "@verkfi/shared/getRepoInfo";
import {
    useAtomValue
} from "jotai";
import LpLogger from "lp-logger";
import {
    ReactNode,
    createContext,
    useEffect
} from "react";
import {
    drawerWidth
} from "setting/consts";
import enUS from "../locales/en-US.json";
import zhCN from "../locales/zh-CN.json";
import zhTW from "../locales/zh-TW.json";
import {
    langIniterAtom
} from "@verkfi/shared/atoms/lang";
import desktopAdder from "./registers/desktopAdder";
import registerProtocolHandler from "./registers/registerProtocolHandler";
import registerServiceWorker from "./registers/registerServiceWorker";
import {
    sidebarModeAtom,
    showSidebarAtom
} from "@verkfi/shared/atoms";
import Clients from "./Clients";
import {
    DevTools
} from "jotai-devtools";
import "jotai-devtools/styles.css";
import {
    themeAtom
} from "setting/appearance/paletteAtom";
import {
    expandAtom
} from "index/atoms";
import Index from "page";
import Menu from "./Menu";
import {
    useSearchParams,
    useLocation
} from "react-router-dom";
export const locales = {
    enUS,
    zhCN,
    zhTW
};
export const logger = new LpLogger({
    name: "Verkfi",
    level: "log" // 空字符串时，不显示任何信息
});
export const repoInfo = createContext<repoInfoType>(null);
export default function ModifiedApp(props: {
    children: ReactNode;
    repoInfo: repoInfoType;
}) {
    const theme = useAtomValue(themeAtom),
        {
            pathname
        } = useLocation(),
        [params] = useSearchParams(),
        expand = useAtomValue(expandAtom),
        implant = pathname === "/" || params.get("only") === "true",
        sidebarModeValue = useAtomValue(sidebarModeAtom),
        ml = implant ? "" : expand ? `calc(min(${`calc(100vw - ${drawerWidth}px)`}, 320px) + ${drawerWidth}px)` : `${drawerWidth}px`,
        Sidebar = implant ? null : sidebarModeValue === "sidebar" ? <Index isImplant /> : <Menu />,
        showSidebarValue = useAtomValue(showSidebarAtom);
    useAtomValue(langIniterAtom);
    useEffect(() => {
        registerProtocolHandler();
        registerServiceWorker();
        desktopAdder();
    }, []);
    return <repoInfo.Provider value={props.repoInfo}>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box component="aside">
                {Sidebar}
                <DevTools />
                <Clients />
            </Box>
            <Box component="main" ml={showSidebarValue && sidebarModeValue === "sidebar" && ml}>
                {props.children}
            </Box>
        </ThemeProvider>
    </repoInfo.Provider>;
}
