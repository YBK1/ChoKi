import type { NextConfig } from 'next';

import nextPWA from 'next-pwa';

const withPWA = nextPWA({
	dest: 'public',
	register: true,
	skipWaiting: true,
}) as (config: NextConfig) => NextConfig;

const nextConfig: NextConfig = {
	reactStrictMode: true,

	// Unity WebGL 필수 헤더 설정
	async headers() {
		return [
			{
				source: '/:path*',
				headers: [
					{
						// SharedArrayBuffer 사용을 위한 COOP 설정
						key: 'Cross-Origin-Embedder-Policy',
						value: 'require-corp',
					},
					{
						// 웹 워커를 위한 COEP 설정
						key: 'Cross-Origin-Opener-Policy',
						value: 'same-origin',
					},
				],
			},
			{
				// Unity 빌드 파일을 위한 특별 설정
				source: '/build/:path*',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=3600',
					},
				],
			},
		];
	},

	// WebAssembly 지원을 위한 webpack 설정
	webpack: config => {
		// WebAssembly 설정
		config.experiments = {
			...config.experiments,
			asyncWebAssembly: true,
		};

		// 대용량 에셋 경고 비활성화
		config.performance = {
			...config.performance,
			hints: false,
		};

		return config;
	},

	// Unity 빌드 파일 처리를 위한 추가 설정
	compress: true, // 정적 파일 압축
};

// PWA와 함께 설정 적용
const configWithPWA = withPWA(nextConfig);

// 개발 환경에서 HTTPS 사용 시 필요한 설정 추가
if (process.env.NODE_ENV === 'development') {
	configWithPWA.rewrites = async () => {
		return [
			{
				source: '/build/:path*',
				destination: '/build/:path*',
			},
		];
	};
}

module.exports = configWithPWA;
// TypeScript 타입을 위한 export
export default configWithPWA;
