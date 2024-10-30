import type { NextConfig } from 'next';

const withPWA = require('next-pwa')({
	dest: 'public',
});
const nextConfig: NextConfig = {
	/* config options here */
	reactStrictMode: true,
};
module.exports = withPWA(nextConfig);
export default nextConfig;
