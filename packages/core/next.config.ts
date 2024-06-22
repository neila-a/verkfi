import bundleAnalyzer from "@next/bundle-analyzer";
import {
    type NextConfig
} from "next";
const nextConfig: NextConfig = bundleAnalyzer({
    enabled: process.env.ANALYZE === "true"
})({
    reactStrictMode: true,
    devIndicators: {
        buildActivityPosition: "bottom-right"
    },
    compress: true,
    experimental: {
        typedRoutes: true
    },
    transpilePackages: ["jotai-devtools"]
});
module.exports = nextConfig;
