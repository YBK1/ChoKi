import { useEffect } from 'react';
import { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
	useEffect(() => {
		// 초기에 서비스 워커를 등록합니다.
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker
				.register('/sw.js')
				.then(registration => {
					console.log(
						'Service Worker registered with scope:',
						registration.scope,
					);
				})
				.catch(error => {
					console.error('Service Worker registration failed:', error);
				});
		}
	}, []);

	return <Component {...pageProps} />;
}

export default MyApp;
