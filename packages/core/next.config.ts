import type {
	NextConfig
} from "next";
import bundleAnalyzer from "@next/bundle-analyzer";
const nextConfig: NextConfig = bundleAnalyzer({
	enabled: process.env.ANALYZE === 'true'
})({
	reactStrictMode: true,
	devIndicators: {
		buildActivityPosition: 'bottom-right',
	},
	compress: true
});
module.exports = nextConfig;
