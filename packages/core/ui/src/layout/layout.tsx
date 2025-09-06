import {
    Box,
    GlobalStyles
} from "@mui/material";
import "filepond/dist/filepond.min.css"; // Import FilePond styles
import {
    Provider
} from "jotai";
import BaseLayout from "layout/layoutClient";
import {
    useEffect
} from "react";
import pack from "../../../../../package.json";
import favicon from "image/favicon.png";
import social from "image/social.png";
function updateMetadata() {
    const upperName = pack.name.charAt(0).toUpperCase() + pack.name.slice(1);
    function replaceMeta(a: string, content: string) {
        const element = document.querySelector(`meta[${a}]`) as HTMLMetaElement;
        element.content = content;
    }

    replaceMeta("name=description", pack.description);
    replaceMeta("name=author", pack.author.name);

    replaceMeta("property=og\\:title", upperName);
    replaceMeta("property=og\\:description", pack.description);
    replaceMeta("property=og\\:url", pack.homepage);
    replaceMeta("property=og\\:site_name", upperName);
    replaceMeta("property=og\\:image", social);

    const link = document.querySelector("link[rel=icon]") as HTMLLinkElement;
    link.href = favicon;
}
export default function Layout() {
    useEffect(updateMetadata, []);
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
                <BaseLayout repoInfo={pack} />
            </Provider>
        </Box>
    );
}
