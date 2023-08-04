import {
Metadata
} from "next";
import layoutClient from "./layoutClient";
export const metadata: Metadata = {
manifest: "/index.webmanifest",                                                   description: "Neila的一些没用工具。" ,                         mobile-web-app-capable: "yes",                                                apple-mobile-web-app-capable: "yes",                                          application-name: "NeilaTools",                                               apple-mobile-web-app-title: "NeilaTools",                                     msapplication-tooltip: "NeilaTools",                                          theme-color: "#1976d2",                                                       msapplication-navbutton-color: "#1976d2",                                     msapplication-starturl: "/",                                                  apple-mobile-web-app-capable: "yes",
icon: "/image/favicon.png"
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
