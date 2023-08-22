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
import React, {
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
import useReadSetting from "./setting/useReadSetting";
import {
    isMobile
} from 'react-device-detect';
var logger = new LpLogger({
    name: "NeilaTools",
    level: "log", // 空字符串时，不显示任何信息
});
declare global {  //设置全局属性
    interface Window {  //window对象属性
        UWAWorker: Promise<ServiceWorkerRegistration>;
        installPWA(): void;
        intl: typeof intl;
    }
}
type colorMode = 'light' | 'dark';
export default function ModifiedApp(props) {
    const initialMode = useReadSetting("darkmode", "暗色模式", "false").replace("false", "light").replace("true", "dark") as colorMode,
        [mode, setMode] = useState<colorMode>(initialMode),
        theme = useMemo(
            () =>
                createTheme({
                    palette: {
                        mode,
                    },
                }),
            [mode]
        );
    useEffect(() => setMode(initialMode), [initialMode]);
    useEffect(() => {
        logger.log("色彩模式为：", mode);
    }, [mode]);
    var [initDone, setInitDone] = useState<boolean>(false);
    intl.init({
        currentLocale: useReadSetting("lang", "语言", "zhCN"),
        locales
    }).then(() => {
        setInitDone(true);
        logger.log("语言已经加载完毕");
    });
    useEffect(() => {
        var url = `${location.origin}/tool?handle=%s`;
        if (!isMobile) {
            logger.log("检测到此设备并非手机");
            navigator.registerProtocolHandler("web+neilatools", url);
        } else {
            logger.log("检测到此设备为手机，停止注册协议");
        }
        if ('serviceWorker' in navigator) {
            // register service worker
            window.UWAWorker = navigator.serviceWorker.register("/service-worker.js");
            window.UWAWorker.then((registration) => logger.log(`Service worker for UWA register success:`, registration)).catch((reason) => logger.error(`Service worker for UWA register fail: ${reason}`));
        }
        var deferredPrompt = null;
        // 监听beforeinstallprompt事件，该事件在网站满足PWA安装条件时触发，保存安装事件
        window.addEventListener("beforeinstallprompt", e => {
            e.preventDefault();
            deferredPrompt = e;
        });
        // 监听appinstalled事件，该事件在用户同意安装后触发，清空安装事件
        window.addEventListener("appinstalled", () => {
            deferredPrompt = null;
        });
        // 手动触发PWA安装
        function addToDesktop() {
            deferredPrompt.prompt();
        }
        window.installPWA = addToDesktop;
        window.intl = intl;
    }, []);
    return (
        initDone && <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className={style["fullHeight"]}>
                {props.children}
            </div>
        </ThemeProvider>
    );
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
