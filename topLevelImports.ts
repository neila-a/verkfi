import {
    AliasOptions,
    PluginOption
} from "vite";
import {
    compilerOptions
} from "./tsconfig.json";
import {
    readdir
} from "node:fs/promises"
export default function topLevelImports() {
    return {
        name: "top-level-imports",
        async config() {
            const {
                baseUrl
            } = compilerOptions,
                entries = await readdir(baseUrl),
                createdAliases: AliasOptions = Object.fromEntries(entries.map(entry => {
                    let importingEntry = entry;
                    if (importingEntry.includes(".")) {
                        importingEntry = importingEntry.split(".").slice(0, -1).join(".");
                    }
                    return [importingEntry, `/${baseUrl}/${importingEntry}`];
                }));
            return {
                resolve: {
                    alias: createdAliases
                }
            };
        }
    } as PluginOption;
}