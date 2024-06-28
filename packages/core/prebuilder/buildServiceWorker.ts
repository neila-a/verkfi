import logbuild from "./logbuild";
const buildServiceWorker = () => logbuild({
    entryPoints: ["./packages/core/service-worker/index.ts"],
    outfile: "packages/core/ui/public/service-worker.js",
    bundle: true,
    sourcemap: "linked",
    minify: true
}, "service-worker.ts");
export default buildServiceWorker;
