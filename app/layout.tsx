import {
    Metadata
} from "next";
import {
    CssBaseline, Typography
} from "@mui/material";
import '@fontsource/ubuntu/300.css';
import '@fontsource/ubuntu/400.css';
import '@fontsource/ubuntu/500.css';
import '@fontsource/ubuntu/700.css';
import style from "./styles/Layout.module.scss";
import "./styles/App.scss";
import BaseLayout, {
    WindowsProvider
} from "./layoutClient";
import Loading from "./loading";
export const metadata: Metadata = {
    manifest: "/index.webmanifest",
    description: "Neila的一些没用工具。",
    applicationName: "NeilaTools",
    other: {
        "msapplication-tooltip": "NeilaTools",
        "msapplication-navbutton-color": "#1976d2",
        "msapplication-starturl": "/",
    },
    themeColor: "#1976d2",
    icons: "/image/favicon.png",
    appleWebApp: {
        title: "NeilaTools"
    },
    title: {
        default: "NeilaTools",
        template: "%s | NeilaTools"
    }
}
export default function Layout({
    children
}) {
    return (
        <html lang="zh-cmn-Hans-CN">
            <body>
                <noscript>
                    <Loading>
                        <Typography>
                            Error: Unable to execute JavaScript.
                        </Typography>
                    </Loading>
                </noscript>
                <main>
                    <CssBaseline />
                    <div className={style["fullHeight"]}>
                        <WindowsProvider>
                            <BaseLayout>
                                {children}
                            </BaseLayout>
                        </WindowsProvider>
                    </div>
                </main>
            </body>
        </html>
    )
};
