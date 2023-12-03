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
} from "./layout/layoutClient";
import {
    Suspense
} from "react";
export default async function Layout({
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
                <div className={style["fullHeight"]}>
                    <Suspense fallback={<Loading />}> {/* 阻止整个页面坠落到客户端模式 */}
                        <WindowsProvider>
                            <BaseLayout>
                                {children}
                            </BaseLayout>
                        </WindowsProvider>
                    </Suspense>
                </div>
            </body>
        </html>
    )
};
