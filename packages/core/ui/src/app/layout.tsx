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
import favicon from "./image/favicon.png";
import social from "./image/social.png";
import getHomePage from "layout/getHomepage";
export async function generateMetadata() {
    const url = getHomePage(),
        repoInfo = await getRepoInfo(),
        upperName = repoInfo.name.charAt(0).toUpperCase() + repoInfo.name.slice(1);
    return {
        manifest: "/manifest.webmanifest",
        metadataBase: url,
        description: repoInfo.description,
        applicationName: upperName,
        other: {
            "msapplication-tooltip": upperName,
            "msapplication-navbutton-color": "#1976d2",
            "msapplication-starturl": "/"
        },
        icons: favicon.src,
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
                    url: social.src,
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
    } satisfies Metadata;
}
export function generateViewport(): Viewport {
    return {
        themeColor: "#1976d2",
        colorScheme: "light dark"
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
