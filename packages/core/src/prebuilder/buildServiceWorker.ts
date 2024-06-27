import logbuild from "./logbuild";
const buildServiceWorker = () => logbuild({
    entryPoints: ["./src/service-worker/index.ts"],
    outfile: "public/service-worker.js",
    bundle: true,
    sourcemap: "linked",
    minify: true
}, "service-worker.ts");
export default buildServiceWorker;
