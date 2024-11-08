import {
    Box,
    GlobalStyles,
    Typography
} from "@mui/material";
import "@fontsource/ubuntu/300.css";
import "@fontsource/ubuntu/400.css";
import "@fontsource/ubuntu/500.css";
import "@fontsource/ubuntu/700.css";
import "filepond/dist/filepond.min.css"; // Import FilePond styles
import {
    Provider
} from "jotai";
import BaseLayout from "layout/layoutClient";
import Loading from "loading";
import {
    Suspense
} from "react";
import pack from "../../package.json";
import favicon from "image/favicon.png";
import social from "image/social.png";
import getHomePage from "layout/getHomepage";
import {
    Outlet
} from "react-router";
export function generateMetadata() {
    const url = getHomePage(),
        upperName = pack.name.charAt(0).toUpperCase() + pack.name.slice(1);
    return {
        manifest: "/manifest.webmanifest",
        metadataBase: url,
        description: pack.description,
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
            description: pack.description,
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
    };
}
export function generateViewport() {
    return {
        themeColor: "#1976d2",
        colorScheme: "light dark"
    };
}
export default function Layout() {
    return (
        <Box sx={{
            minHeight: "100vh"
        }}>
            <GlobalStyles styles={{
                "body": {
                    margin: 0,
                    scrollbarWidth: "none",
                    msOverflowStyle: "none"
                },
                "& *": {
                    fontFamily: "Ubuntu"
                },
                "& ::-webkit-scrollbar": {
                    display: "none"
                },
                ".filepond--root .filepond--credits": {
                    display: "none"
                }
            }} />
            <Provider>
                <Suspense fallback={<Loading />}>
                    <BaseLayout repoInfo={pack}>
                        <Outlet />
                    </BaseLayout>
                </Suspense>
            </Provider>
        </Box>
    );
}
