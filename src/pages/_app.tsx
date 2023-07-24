// import App from "next/app";
import type {
    AppProps /*, AppContext */
} from 'next/app';
import enUS from "../locales/en-US.json";
import zhCN from "../locales/zh-CN.json";
import zhTW from "../locales/zh-TW.json";
import rkRK from "../locales/rk-RK.json";
export const locales = {
    enUS,
    zhCN,
    zhTW,
    rkRK
};
import intl from 'react-intl-universal';
import React, {
    useEffect,
    useState,
    createContext,
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
import style from "../styles/ModifiedApp.module.scss";
import "../styles/App.scss";
import useReadSetting from "../components/setting/useReadSetting"
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
    }
}
export const ColorModeContext = createContext({
    toggleColorMode: () => { }
});
export default function ModifiedApp({ Component, pageProps }: AppProps) {
    const [mode, setMode] = useState<'light' | 'dark'>(useReadSetting("darkmode", "暗色模式", "false").replace("false", "light").replace("true", "dark"));
    const colorMode = useMemo(() => ({
        toggleColorMode: () => {
            logger.log("正在切换色彩模式");
            setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
        },
    }), [],);
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                },
            }),
        [mode],
    );
    var [initDone, setInitDone] = useState<boolean>(false);
    intl.init({
        currentLocale: useReadSetting("lang", "语言", "zhCN"),
        locales
    }).then(() => {
        setInitDone(true);
        logger.log("语言已经加载完毕");
    });
    useEffect(() => {
        logger.log(useReadSetting("darkmode", "暗色模式", "false").replace("false", "light").replace("true", "dark"))
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
    }, []);
    return (
        initDone && <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className={style["fullHeight"]}>
                    <Component {...pageProps} />
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
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
