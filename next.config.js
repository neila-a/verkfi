/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
		// Important: return the modified config
		return config
	},
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true,
	},
	devIndicators: {
		buildActivityPosition: 'bottom-right',
	},
}

module.exports = nextConfig;
