import {
    defineConfig
} from "vite";
import react from "@vitejs/plugin-react";
import generateFile from "vite-plugin-generate-file";
import virtualModules from "./virtualModules";
import topLevelImports from "./topLevelImports";
import manifest from "./manifest";
// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        virtualModules(),
        topLevelImports(),
        generateFile([{
            type: "json",
            output: "manifest.webmanifest",
            data: manifest()
        }])
    ],
    root: ".",
    worker: {
        plugins: () => [virtualModules()],
        rollupOptions: {
            output: {
                entryFileNames() {
                    return "worker-[hash].js";
                },
            }
        }
    }
});
