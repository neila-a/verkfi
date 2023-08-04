import {
Metadata
} from "next";
import layoutClient from "./layoutClient";
export const metadata: Metadata = {
manifest: "/index.webmanifest",
description: "Neila的一些没用工具。" ,
applicationName: "NeilaTools",
other: {
"msapplication-tooltip": "NeilaTools",
"msapplication-navbutton-color": "#1976d2",
"msapplication-starturl": "/",
},
themeColor: "#1976d2",
icon: "/image/favicon.png",
appleWebApp: {
title: "NeilaTools"
}
}
export default function Layout({ children }) {
        return (
            <html lang="zh-cmn-Hans-CN">
                <body>
                <Layout children={children} />
                </body>
            </html>
        )
    }
};
