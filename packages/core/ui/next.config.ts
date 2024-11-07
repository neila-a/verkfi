import bundleAnalyzer from "@next/bundle-analyzer";
import {
    type NextConfig
} from "next";
const nextConfig: NextConfig = bundleAnalyzer({
    enabled: process.env.ANALYZE === "true"
})({
    reactStrictMode: true,
    output: "export",
    devIndicators: {
        buildActivityPosition: "bottom-right"
    },
    compress: true,
    experimental: {
        typedRoutes: true
        // disabled: reactCompiler: true
    },
    transpilePackages: ["jotai-devtools"]
});
export default nextConfig;
