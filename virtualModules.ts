import {
    execSync
} from "node:child_process";
import {
    PluginOption
} from "vite";
export function verkfiEnv() {
    const virtualModuleId = 'virtual:verkfi-env',
        resolvedVirtualModuleId = '\0' + virtualModuleId,
        stdout = execSync("git log --oneline | wc -l", {
            encoding: "utf-8"
        }),
        commits = stdout.replace(/\n/g, "");
    return {
        name: 'verkfi-env',
        resolveId(id: string) {
            if (id === virtualModuleId) {
                return resolvedVirtualModuleId;
            }
        },
        load(id: string) {
            if (id === resolvedVirtualModuleId) {
                return `export const devVersion = ${commits};`;
            }
        }
    } as PluginOption;
}
export default () => [verkfiEnv()];