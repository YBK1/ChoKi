import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<link rel="manifest" href="/manifest.json" />
				<link rel="icon" href="/public/choki512x512.png" />
			</Head>
			<body className="antialiased">
				<div id="root">
					<Main />
					<NextScript />
				</div>
			</body>
		</Html>
	);
}
