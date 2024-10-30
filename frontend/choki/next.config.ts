import type { NextConfig } from 'next';

const withPWA = require('next-pwa')({
	dest: 'public', // PWA 파일이 저장될 위치 설정
	register: true, // 서비스 워커를 등록
	skipWaiting: true, // 새로운 서비스 워커가 대기하지 않고 즉시 활성화
	// customWorkerDir: 'path/to/your/custom/sw', // 사용자 정의 서비스 워커 디렉토리 경로
});
const nextConfig: NextConfig = {
	/* config options here */
	reactStrictMode: true,
};
module.exports = withPWA(nextConfig);
export default nextConfig;
