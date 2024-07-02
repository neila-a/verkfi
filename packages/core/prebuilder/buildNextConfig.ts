import logbuild from "./logbuild";
const buildNextConfig = () => logbuild({
    entryPoints: ["packages/core/ui/next.config.ts"],
    outfile: "packages/core/ui/next.config.js",
    format: "cjs",
    minify: true,
    platform: "node",
    treeShaking: true
}, "next.config.ts");
export default buildNextConfig;
