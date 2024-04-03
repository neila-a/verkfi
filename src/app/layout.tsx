import {
    Metadata
} from "next";
import {
    getRepoInfo
} from "./components/getRepoInfo";
export async function generateMetadata() {
    const repoInfo = await getRepoInfo(),
        upperName = repoInfo.name.charAt(0).toUpperCase() + repoInfo.name.slice(1);
    return ({
        manifest: "/index.webmanifest",
        description: repoInfo.description,
        applicationName: upperName,
        other: {
            "msapplication-tooltip": upperName,
            "msapplication-navbutton-color": "#1976d2",
            "msapplication-starturl": "/",
        },
        icons: "/image/favicon.png",
        appleWebApp: {
            title: upperName
        },
        title: {
            default: upperName,
            template: `%s | ${upperName}`
        },
        openGraph: {
            title: upperName,
            description: repoInfo.description,
            url: pack.homepage,
            siteName: upperName,
            images: [
                {
                    url: './image/social.png',
                    width: 1280,
                    height: 640,
                }
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
    Viewport
} from "next";
export function generateViewport(): Viewport {
    return {
        themeColor: "#1976d2",
    };
}
import '@fontsource/ubuntu/300.css';
import '@fontsource/ubuntu/400.css';
import '@fontsource/ubuntu/500.css';
import '@fontsource/ubuntu/700.css';
import 'filepond/dist/filepond.min.css'; // Import FilePond styles
import pack from "../../package.json";
import {
    Box,
    GlobalStyles,
    Typography
} from "@mui/material";
import Loading from "./loading";
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
            <body style={{
                margin: 0,
                scrollbarWidth: "none",
                msOverflowStyle: "none"
            }}>
                <GlobalStyles styles={{
                    ["& *"]: {
                        "font-family": "Ubuntu !important"
                    },
                    ["& ::-webkit-scrollbar"]: {
                        display: "none"
                    }
                }} />
                <noscript>
                    <Loading>
                        <Typography>
                            Error: Unable to execute JavaScript.
                        </Typography>
                    </Loading>
                </noscript>
                <Box sx={{
                    minHeight: "100vh"
                }}>
                    <Suspense fallback={<Loading />}> {/* 阻止整个页面坠落到客户端模式 */}
                        <WindowsProvider>
                            <BaseLayout>
                                {children}
                            </BaseLayout>
                        </WindowsProvider>
                    </Suspense>
                </Box>
            </body>
        </html>
    )
};
