import type {
	NextConfig
} from "next";
const nextConfig: NextConfig = {
	reactStrictMode: true,
	devIndicators: {
		buildActivityPosition: 'bottom-right',
	}
}

module.exports = nextConfig;
