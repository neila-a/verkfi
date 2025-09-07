import {
    defineConfig
} from "vite";
import react from "@vitejs/plugin-react";
import virtualModules from "./virtualModules";
import topLevelImports from "./topLevelImports";
// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        virtualModules(),
        topLevelImports()
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
