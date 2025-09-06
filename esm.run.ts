import minVersion from "semver/ranges/min-version";
import cdn from "vite-plugin-cdn-import";
import {
    readFile,
    readdir,
    lstat
} from "node:fs/promises";
import rootPackage from "./package.json";
import {
    HtmlTagDescriptor,
    Plugin
} from "vite";
export default function toESMrun() {
    async function getAliases() {
        type dependencies = Record<string, string>;
        let allDependencies: dependencies = rootPackage.dependencies;
        async function readDir(path: string) {
            const files = await readdir(path);
            return Promise.all(files.map(async file => {
                const filePath = `${path}/${file}`;
                switch (file) {
                    case "node_modules":
                        break;
                    case "package.json":
                        const {
                            dependencies
                        } = JSON.parse(await readFile(filePath, "utf-8"));
                        allDependencies = {
                            ...allDependencies,
                            ...dependencies
                        };
                        break;
                    default:
                        if ((await lstat(filePath)).isDirectory()) {
                            await readDir(filePath);
                        }
                }
            }));
        }
        await readDir(`${__dirname}/packages`);

        const aliases: dependencies = {};
        Object.entries(allDependencies).forEach(([name, version]) => {
            if (version.startsWith("workspace:") || version.startsWith("github:")) {
                return;
            } else {
                aliases[name] = `https://esm.sh/${name}@${minVersion(version)}`;
            }
        });
        return aliases;
    }
    return {
        name: "esm.run",
        async options(options) {
            const aliases = await getAliases();
            console.log("neu config", {
                ...options,
                external: Object.keys(aliases)
            });
            return {
                ...options,
                external: Object.keys(aliases)
            };
        },
        async transformIndexHtml(html) {
            if (process.env.NODE_ENV === 'development') {
                return html;
            }

            const aliases = await getAliases();

            return [{
                tag: "script",
                attrs: {
                    type: "importmap"
                },
                children: JSON.stringify({
                    imports: aliases
                })
            }];
        }
    } as Plugin;
}
