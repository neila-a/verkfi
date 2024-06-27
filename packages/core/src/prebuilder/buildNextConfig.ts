import logbuild from "./logbuild";
const buildNextConfig = () => logbuild({
    entryPoints: ["next.config.ts"],
    outfile: "next.config.js",
    format: "cjs",
    platform: "node"
}, "next.config.ts");
export default buildNextConfig;
