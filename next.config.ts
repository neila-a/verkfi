import type {
	NextConfig
} from "next";
const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true'
});
const nextConfig: NextConfig = withBundleAnalyzer({
	reactStrictMode: true,
	devIndicators: {
		buildActivityPosition: 'bottom-right',
	},
	compress: true
});
module.exports = nextConfig;
