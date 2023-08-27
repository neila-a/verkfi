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
import '@fontsource/ubuntu/300.css';
import '@fontsource/ubuntu/400.css';
import '@fontsource/ubuntu/500.css';
import '@fontsource/ubuntu/700.css';
import {
    useEffect,
    useState,
    useMemo
} from 'react';
import {
    CssBaseline
} from "@mui/material";
import {
    ThemeProvider,
    createTheme
} from "@mui/material/styles"
import LpLogger from "lp-logger";
import style from "./styles/ModifiedApp.module.scss";
import "./styles/App.scss";
import {
    BeforeInstallPromptEvent
} from "./declare";
import checkOption from "./setting/checkOption";
var logger = new LpLogger({
    name: "NeilaTools",
    level: "log", // 空字符串时，不显示任何信息
});
export type colorMode = 'light' | 'dark';
export const isBrowser = () => typeof window !== 'undefined'; // The approach recommended by Next.js
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
    useEffect(() => {
        logger.log("色彩模式为：", mode);
    }, [mode]);
    var [initDone, setInitDone] = useState<boolean>(false);
    intl.init({
        currentLocale: choosedLang,
        locales
    }).then(() => {
        setInitDone(true);
        logger.log("语言已经加载完毕");
    });
    useEffect(() => {
        var url = `${location.origin}/tool?handle=%s`;
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
    }, []);
    return initDone && <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className={style["fullHeight"]}>
            {props.children}
        </div>
    </ThemeProvider>;
}
// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext: AppContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//   return { ...appProps }
// }
