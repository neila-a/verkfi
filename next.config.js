/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
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
       images: {
           loader: 'static'
    }
}
module.exports = nextConfig;
