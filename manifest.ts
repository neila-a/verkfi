import pack from "./package.json";
export default function manifest() {
    const upper = pack.name.charAt(0).toUpperCase() + pack.name.slice(1);
    return {
        name: upper,
        short_name: upper,
        description: pack.description,
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
                src: "image/favicon.310x310.png",
                sizes: "310x310",
                type: "image/png",
                purpose: "any"
            },
            {
                src: "/image/favicon.512x512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any"
            },
            {
                src: "/image/maskable_icon.png",
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
                        src: "/image/settings.png",
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
                src: "/image/screenshots/narrow_homepage.png",
                sizes: "430x933",
                type: "image/png",
                form_factor: "narrow",
                label: "Home of Verkfi"
            },
            {
                src: "/image/screenshots/wide_homepage.png",
                sizes: "1505x782",
                type: "image/png",
                form_factor: "wide",
                label: "Home of Verkfi"
            }
        ]
    };
}
