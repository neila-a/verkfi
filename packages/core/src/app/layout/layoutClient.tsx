"use client";
import {
    Box,
    CssBaseline
} from "@mui/material";
import {
    CssVarsProvider,
    extendTheme
} from "@mui/material/styles";
import Ubuntu from "@verkfi/shared/fonts";
import {
    repoInfo as repoInfoType
} from "@verkfi/shared/getRepoInfo";
import {
    useAtom,
    useAtomValue
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
    useState
} from "react";
import intl from "react-intl-universal";
import {
    drawerWidth
} from "setting/consts";
import enUS from "../locales/en-US.json";
import zhCN from "../locales/zh-CN.json";
import zhTW from "../locales/zh-TW.json";
import {
    usableLangAtom
} from "@verkfi/shared/atoms/lang";
import composeProviders from "./providerCompose";
import desktopAdder from "./registers/desktopAdder";
import registerProtocolHandler from "./registers/registerProtocolHandler";
import registerServiceWorker from "./registers/registerServiceWorker";
import {
    sidebarModeAtom,
    showSidebarAtom
} from "@verkfi/shared/atoms";
import isBrowser from "@verkfi/shared/isBrowser";
import Clients from "./Clients";
import {
    DevTools
} from "jotai-devtools";
import "jotai-devtools/styles.css";
import {
    themeAtom
} from "setting/appearance/paletteAtom";
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
        pathname = usePathname(),
        params = useSearchParams(),
        choosedLang = useAtomValue(usableLangAtom),
        [expand, setExpand] = useState<boolean>(false),
        [loaded, setLoaded] = useState<"" | keyof typeof locales>(""),
        implant = (pathname === "/") || (params.get("only") === "true"),
        sidebarModeValue = useAtomValue(sidebarModeAtom),
        ml: string = implant ? "" : (expand ? `calc(min(${`calc(100vw - ${drawerWidth}px)`}, 320px) + ${drawerWidth}px)` : `${drawerWidth}px`),
        Sidebar = implant ? null : (sidebarModeValue === "menu" ? createElement(dynamic(() => import("./Menu"))) : createElement(dynamic(() => import("page")), {
            isImplant: true,
            expand: expand,
            setExpand: setExpand
        })), // 使用createElement因为dynamic不能直接以JSX方式调用
        showSidebarValue = useAtomValue(showSidebarAtom),
        Provider = composeProviders([repoInfo, props.repoInfo]);
    useEffect(() => {
        if (isBrowser()) {
            registerProtocolHandler();
            registerServiceWorker();
        } else {
            logger.error(`执行BOM相关操作时发生错误`);
        }
        desktopAdder();
    }, []);
    useEffect(() => {
        intl.init({
            currentLocale: choosedLang,
            locales
        });
        setLoaded(choosedLang);
    }, [choosedLang]);
    return loaded !== "" && (
        <Provider>
            <CssVarsProvider theme={theme}>
                <CssBaseline />
                <Box component="aside">
                    {Sidebar}
                    <DevTools />
                    <Clients />
                </Box>
                <Box component="main" ml={(showSidebarValue && sidebarModeValue === "sidebar") && ml}>
                    {props.children}
                </Box>
            </CssVarsProvider>
        </Provider>
    );
}
