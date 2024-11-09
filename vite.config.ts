import {
    defineConfig
} from "vite";
import react from "@vitejs/plugin-react";
// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react()
    ],
    root: ".",
    resolve: {
        alias: {
            declare: "/packages/core/ui/src/declare.ts",
            error: "/packages/core/ui/src/error.tsx",
            "global-error": "/packages/core/ui/src/global-error.tsx",
            image: "/packages/core/ui/src/image",
            index: "/packages/core/ui/src/index",
            installExtension: "/packages/core/ui/src/installExtension.tsx",
            layout: "/packages/core/ui/src/layout",
            loading: "/packages/core/ui/src/loading.tsx",
            locales: "/packages/core/ui/src/locales",
            main: "/packages/core/ui/src/main.tsx",
            manifest: "/packages/core/ui/src/manifest.ts",
            "not-found": "/packages/core/ui/src/not-found.tsx",
            pages: "/packages/core/ui/src/pages.json",
            page: "/packages/core/ui/src/page.tsx",
            setting: "/packages/core/ui/src/setting",
            sitemap: "/packages/core/ui/src/sitemap.ts",
            tools: "/packages/core/ui/src/tools"
        }
    }
});
