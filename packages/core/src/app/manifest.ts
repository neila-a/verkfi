import getRepoInfo from "@verkfi/shared/getRepoInfo";
import pack from "../../package.json";
import favicon310x310 from "./image/favicon.310x310.png";
import favicon512x512 from "./image/favicon.512x512.png";
import maskableIcon from "./image/maskable_icon.png";
import settingIcon from "./image/settings.png";
import narrowHomepage from "./image/screenshots/narrow_homepage.png";
import wideHomepage from "./image/screenshots/wide_homepage.png";
export default async function manifest() {
    const repoInfo = await getRepoInfo(),
        upper = repoInfo.name.charAt(0).toUpperCase() + repoInfo.name.slice(1);
    return {
        name: upper,
        short_name: upper,
        description: repoInfo.description,
        start_url: "/",
        display: "fullscreen",
        orientation: "any",
        background_color: "#2196f3",
        theme_color: "#2196f3",
        launch_handler: {
            client_mode: "auto"
        },
        icons: [
            {
                src: favicon310x310.src,
                sizes: "310x310",
                type: "image/png",
                purpose: "any"
            },
            {
                src: favicon512x512.src,
                sizes: "512x512",
                type: "image/png",
                purpose: "any"
            },
            {
                src: maskableIcon.src,
                sizes: "731x731",
                type: "image/png",
                purpose: "maskable"
            }
        ],
        shortcuts: [
            {
                name: "设置",
                short_name: "设置",
                description: "设置",
                url: "/setting/option",
                icons: [
                    {
                        src: settingIcon.src,
                        sizes: "96x96"
                    }
                ]
            }
        ],
        protocol_handlers: [
            {
                protocol: "web+verkfi",
                url: "/handle?handle=%s"
            }
        ],
        id: pack.name,
        display_override: [
            "window-controls-overlay",
            "fullscreen",
            "standalone",
            "minimal-ui",
            "browser"
        ],
        lang: "zh",
        dir: "ltr",
        prefer_related_applications: false,
        categories: [
            "utilities"
        ],
        edge_side_panel: {
            "preferred_width": 320
        },
        screenshots: [
            {
                src: narrowHomepage.src,
                sizes: "430x933",
                type: "image/png",
                form_factor: "narrow",
                label: "Home of Verkfi"
            },
            {
                src: wideHomepage.src,
                sizes: "1505x782",
                type: "image/png",
                form_factor: "wide",
                label: "Home of Verkfi"
            }
        ]
    };
}
