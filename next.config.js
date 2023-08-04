/** @type {import('next').NextConfig} */
const esbuildLoader = require('esbuild-loader');
const nextConfig = {
	webpack: (config, options) => {
    // 添加 esbuildLoader 配置
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      loader: esbuildLoader.Loader,
      options: {
        loader: 'jsx', // 设定处理的文件类型
        target: 'es2015' // 设定生成的代码规范类型
      }
    });
    return config;
  },
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
}

module.exports = nextConfig;
