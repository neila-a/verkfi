// import App from "next/app";
import type { AppProps /*, AppContext */ } from 'next/app'
import React, { useEffect } from 'react';
import LpLogger from "lp-logger";
export var logger = new LpLogger({
    name: "NeilaTools",
    level: "log", // 空字符串时，不显示任何信息
    search: "logger_level", // 配置 URL 控制参数
});
declare global {  //设置全局属性
    interface Window {  //window对象属性
        UWAWorker: Promise<ServiceWorkerRegistration>;
    }
}
function MyApp({ Component, pageProps }: AppProps) {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            // register service worker
            window.UWAWorker = navigator.serviceWorker.register("/service-worker.js");
            window.UWAWorker.then(function (registration) {
                logger.log(`Service worker for UWA register success:`);
                console.log(registration);
            }).catch(function (reason) {
                logger.error(`Service worker for UWA register fail: ${reason}`);
            });
        }
    }, []);
    return <Component {...pageProps} />;
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
export default MyApp;