import {
    Box,
    GlobalStyles,
    Typography
} from "@mui/material";
import {
    AppRouterCacheProvider
} from "@mui/material-nextjs/v13-appRouter";
import Ubuntu from "@verkfi/shared/fonts";
import getRepoInfo from "@verkfi/shared/getRepoInfo";
import "filepond/dist/filepond.min.css"; // Import FilePond styles
import {
    Provider
} from "jotai";
import BaseLayout from "layout/layoutClient";
import Loading from "loading";
import {
    Metadata,
    Viewport
} from "next";
import {
    Suspense
} from "react";
import pack from "../../package.json";
export async function generateMetadata() {
    let url = new URL(pack.homepage);
    try {
        url = new URL(process.env.VERKFI_URL);
    } catch (reason) {
        console.error(`URL build failed, reason: ${reason}. Using ${url} from homepage in package.json.`);
    }
    const repoInfo = await getRepoInfo(),
        upperName = repoInfo.name.charAt(0).toUpperCase() + repoInfo.name.slice(1);
    return ({
        manifest: "/index.webmanifest",
        metadataBase: url,
        description: repoInfo.description,
        applicationName: upperName,
        other: {
            "msapplication-tooltip": upperName,
            "msapplication-navbutton-color": "#1976d2",
            "msapplication-starturl": "/"
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
                    url: "./image/social.png",
                    width: 1280,
                    height: 640
                }
            ],
            locale: "zh_CN",
            alternateLocale: [
                "zh_TW",
                "en_US"
            ]
        },
        authors: pack.author
    }) satisfies Metadata;
}
export function generateViewport(): Viewport {
    return {
        themeColor: "#1976d2"
    };
}
export default async function Layout({
    children
}) {
    const repoInfo = await getRepoInfo();
    return (
        <html lang="zh-cmn-Hans-CN">
            <body style={{
                margin: 0,
                scrollbarWidth: "none",
                msOverflowStyle: "none"
            }}>
                <AppRouterCacheProvider>
                    <GlobalStyles styles={{
                        "& *": {
                            fontFamily: Ubuntu.style.fontFamily
                        },
                        "& ::-webkit-scrollbar": {
                            display: "none"
                        },
                        ".filepond--root .filepond--credits": {
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
                        <Provider>
                            <Suspense fallback={<Loading />}>
                                <BaseLayout repoInfo={repoInfo}>
                                    {children}
                                </BaseLayout>
                            </Suspense>
                        </Provider>
                    </Box>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
