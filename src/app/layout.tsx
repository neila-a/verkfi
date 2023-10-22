import {
    Metadata
} from "next";
import {
    getRepoInfo
} from "./components/getRepoInfo";
export async function generateMetadata() {
    const repoInfo = await getRepoInfo();
    return ({
        manifest: "/index.webmanifest",
        description: repoInfo.description,
        applicationName: repoInfo.name,
        other: {
            "msapplication-tooltip": repoInfo.name,
            "msapplication-navbutton-color": "#1976d2",
            "msapplication-starturl": "/",
        },
        themeColor: "#1976d2",
        icons: "/image/favicon.png",
        appleWebApp: {
            title: repoInfo.name
        },
        title: {
            default: repoInfo.name,
            template: `%s | ${repoInfo.name}`
        },
        openGraph: {
            title: repoInfo.name,
            description: repoInfo.description,
            url: pack.homepage,
            siteName: repoInfo.name,
            images: [
                {
                    url: './image/social.png',
                    width: 1280,
                    height: 640,
                },
            ],
            locale: 'zh_CN',
            alternateLocale: [
                "zh_TW",
                "en_US"
            ]
        }
    }) as Metadata;
}
import {
    Analytics
} from '@vercel/analytics/react';
import '@fontsource/ubuntu/300.css';
import '@fontsource/ubuntu/400.css';
import '@fontsource/ubuntu/500.css';
import '@fontsource/ubuntu/700.css';
import 'filepond/dist/filepond.min.css'; // Import FilePond styles
import style from "./styles/Layout.module.scss";
import pack from "../../package.json";
import {
    Typography
} from "@mui/material";
import Loading from "./loading";
import "./styles/App.scss";
import BaseLayout, {
    WindowsProvider
} from "./layoutClient";
export default async function Layout({
    children
}) {
    const repoInfo = await getRepoInfo();
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
                    <div className={style["fullHeight"]}>
                        <WindowsProvider>
                            <BaseLayout>
                                {children}
                            </BaseLayout>
                        </WindowsProvider>
                    </div>
                </main>
                <Analytics />
            </body>
        </html>
    )
};
