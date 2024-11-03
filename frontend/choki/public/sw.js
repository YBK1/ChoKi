if (!self.define) {
	let e,
		n = {};
	const s = (s, i) => (
		(s = new URL(s + '.js', i).href),
		n[s] ||
			new Promise(n => {
				if ('document' in self) {
					const e = document.createElement('script');
					(e.src = s), (e.onload = n), document.head.appendChild(e);
				} else (e = s), importScripts(s), n();
			}).then(() => {
				let e = n[s];
				if (!e) throw new Error(`Module ${s} didn’t register its module`);
				return e;
			})
	);
	self.define = (i, a) => {
		const c =
			e ||
			('document' in self ? document.currentScript.src : '') ||
			location.href;
		if (n[c]) return;
		let t = {};
		const o = e => s(e, c),
			r = { module: { uri: c }, exports: t, require: o };
		n[c] = Promise.all(i.map(e => r[e] || o(e))).then(e => (a(...e), t));
	};
}
define(['./workbox-4754cb34'], function (e) {
	'use strict';
	importScripts(),
		self.skipWaiting(),
		e.clientsClaim(),
		e.precacheAndRoute(
			[
				{
					url: '/_next/static/Q7PfC6Zf4H6MlbJ3T9ZqR/_buildManifest.js',
					revision: 'bb02bd889088cb501ae249999549a427',
				},
				{
					url: '/_next/static/Q7PfC6Zf4H6MlbJ3T9ZqR/_ssgManifest.js',
					revision: 'b6652df95db52feb4daf4eca35380933',
				},
				{
					url: '/_next/static/chunks/framework-516982be4eea35ea.js',
					revision: '516982be4eea35ea',
				},
				{
					url: '/_next/static/chunks/main-04794588bde29df5.js',
					revision: '04794588bde29df5',
				},
				{
					url: '/_next/static/chunks/pages/_app-218d9da4d77e8bba.js',
					revision: '218d9da4d77e8bba',
				},
				{
					url: '/_next/static/chunks/pages/_error-8c2b6ff87cd513a2.js',
					revision: '8c2b6ff87cd513a2',
				},
				{
					url: '/_next/static/chunks/pages/index-6213f3d6c09a445f.js',
					revision: '6213f3d6c09a445f',
				},
				{
					url: '/_next/static/chunks/pages/login-7f02457aef4ffae2.js',
					revision: '7f02457aef4ffae2',
				},
				{
					url: '/_next/static/chunks/polyfills-42372ed130431b0a.js',
					revision: '846118c33b2c0e922d7b3a7676f81f6f',
				},
				{
					url: '/_next/static/chunks/webpack-59041051e025bed2.js',
					revision: '59041051e025bed2',
				},
				{
					url: '/_next/static/css/ca8146e460817960.css',
					revision: 'ca8146e460817960',
				},
				{
					url: '/choki192x192.png',
					revision: 'e2c545a8f821800d682002d8b98685a9',
				},
				{
					url: '/choki512x512.png',
					revision: 'd374325a57f2e48ec9b64fa20a402f15',
				},
				{
					url: '/fonts/Pretendard-Black.woff2',
					revision: '2af430c08505f68fe8ccbd974e4c85f1',
				},
				{
					url: '/fonts/Pretendard-Bold.woff2',
					revision: '33860c9446a2671456e4619020774137',
				},
				{
					url: '/fonts/Pretendard-ExtraBold.woff2',
					revision: '4e75935a8e92c6b078d8e1bafd81cb42',
				},
				{
					url: '/fonts/Pretendard-ExtraLight.woff2',
					revision: 'e54830d29ec09047650dbb81e9a2f3bd',
				},
				{
					url: '/fonts/Pretendard-Light.woff2',
					revision: '6e125543eff1bb5e7dde302f1f50a7b0',
				},
				{
					url: '/fonts/Pretendard-Medium.woff2',
					revision: '65d0a735617322a4fe0bcc5350642159',
				},
				{
					url: '/fonts/Pretendard-Regular.otf',
					revision: '84c0ea9d65324c758c8bd9686207afea',
				},
				{
					url: '/fonts/Pretendard-SemiBold.woff2',
					revision: 'd3b288a528801dae385d6f104693e022',
				},
				{
					url: '/fonts/Pretendard-Thin.woff2',
					revision: '120b8200ef02c54246f59471bf4dfcdd',
				},
				{
					url: '/icons/back.png',
					revision: '93dd4eed9493d5812aa7d39d0f8d196d',
				},
				{
					url: '/icons/backArrow_icon_navi.png',
					revision: '2b8066fd59936e9935cbcb51aef6d95a',
				},
				{
					url: '/icons/check_icon.png',
					revision: '2a98d153290d07a38ae3062e77cf2a13',
				},
				{
					url: '/icons/clock_icon.png',
					revision: '35b367dafb90a1bafa4a93134faff259',
				},
				{
					url: '/icons/close_icon.png',
					revision: '757f54567cc7e39947a73b800e10423e',
				},
				{
					url: '/icons/plus_btn.png',
					revision: '4b26a878618587f30f1afe00c78e73b9',
				},
				{
					url: '/icons/plus_icon_dark.png',
					revision: '3e7682be079e6470cbdce2d2c840838c',
				},
				{
					url: '/icons/right_icon_navi.png',
					revision: '5190bba4276e35e1f85de0ac5ce61ae1',
				},
				{
					url: '/icons/search_icon.png',
					revision: '198336f90a9bf5d41dde44334fbbd5de',
				},
				{
					url: '/icons/step_icon.png',
					revision: '6199f8607bd6b0fc4d51dbba352d39a3',
				},
				{
					url: '/icons/upArrow_icon.png',
					revision: '311dc658807e29a9613e47ccebfbbbf1',
				},
				{
					url: '/icons/upArrow_icon_navi.png',
					revision: '3626ee82f09b9eec75595b9f7107d4fb',
				},
				{ url: '/manifest.json', revision: '99a3358a47d7a873ec58939255bfed58' },
			],
			{ ignoreURLParametersMatching: [] },
		),
		e.cleanupOutdatedCaches(),
		e.registerRoute(
			'/',
			new e.NetworkFirst({
				cacheName: 'start-url',
				plugins: [
					{
						cacheWillUpdate: async ({
							request: e,
							response: n,
							event: s,
							state: i,
						}) =>
							n && 'opaqueredirect' === n.type
								? new Response(n.body, {
										status: 200,
										statusText: 'OK',
										headers: n.headers,
									})
								: n,
					},
				],
			}),
			'GET',
		),
		e.registerRoute(
			/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
			new e.CacheFirst({
				cacheName: 'google-fonts-webfonts',
				plugins: [
					new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
				],
			}),
			'GET',
		),
		e.registerRoute(
			/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
			new e.StaleWhileRevalidate({
				cacheName: 'google-fonts-stylesheets',
				plugins: [
					new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
				],
			}),
			'GET',
		),
		e.registerRoute(
			/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
			new e.StaleWhileRevalidate({
				cacheName: 'static-font-assets',
				plugins: [
					new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
				],
			}),
			'GET',
		),
		e.registerRoute(
			/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
			new e.StaleWhileRevalidate({
				cacheName: 'static-image-assets',
				plugins: [
					new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
				],
			}),
			'GET',
		),
		e.registerRoute(
			/\/_next\/image\?url=.+$/i,
			new e.StaleWhileRevalidate({
				cacheName: 'next-image',
				plugins: [
					new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
				],
			}),
			'GET',
		),
		e.registerRoute(
			/\.(?:mp3|wav|ogg)$/i,
			new e.CacheFirst({
				cacheName: 'static-audio-assets',
				plugins: [
					new e.RangeRequestsPlugin(),
					new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
				],
			}),
			'GET',
		),
		e.registerRoute(
			/\.(?:mp4)$/i,
			new e.CacheFirst({
				cacheName: 'static-video-assets',
				plugins: [
					new e.RangeRequestsPlugin(),
					new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
				],
			}),
			'GET',
		),
		e.registerRoute(
			/\.(?:js)$/i,
			new e.StaleWhileRevalidate({
				cacheName: 'static-js-assets',
				plugins: [
					new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
				],
			}),
			'GET',
		),
		e.registerRoute(
			/\.(?:css|less)$/i,
			new e.StaleWhileRevalidate({
				cacheName: 'static-style-assets',
				plugins: [
					new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
				],
			}),
			'GET',
		),
		e.registerRoute(
			/\/_next\/data\/.+\/.+\.json$/i,
			new e.StaleWhileRevalidate({
				cacheName: 'next-data',
				plugins: [
					new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
				],
			}),
			'GET',
		),
		e.registerRoute(
			/\.(?:json|xml|csv)$/i,
			new e.NetworkFirst({
				cacheName: 'static-data-assets',
				plugins: [
					new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
				],
			}),
			'GET',
		),
		e.registerRoute(
			({ url: e }) => {
				if (!(self.origin === e.origin)) return !1;
				const n = e.pathname;
				return !n.startsWith('/api/auth/') && !!n.startsWith('/api/');
			},
			new e.NetworkFirst({
				cacheName: 'apis',
				networkTimeoutSeconds: 10,
				plugins: [
					new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
				],
			}),
			'GET',
		),
		e.registerRoute(
			({ url: e }) => {
				if (!(self.origin === e.origin)) return !1;
				return !e.pathname.startsWith('/api/');
			},
			new e.NetworkFirst({
				cacheName: 'others',
				networkTimeoutSeconds: 10,
				plugins: [
					new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
				],
			}),
			'GET',
		),
		e.registerRoute(
			({ url: e }) => !(self.origin === e.origin),
			new e.NetworkFirst({
				cacheName: 'cross-origin',
				networkTimeoutSeconds: 10,
				plugins: [
					new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
				],
			}),
			'GET',
		);
});
