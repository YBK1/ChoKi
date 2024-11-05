import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';
export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<link rel="manifest" href="/manifest.json" />
				<link rel="icon" href="/public/choki512x512.png" />
				<script
					type="text/javascript"
					src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=20b43e8fdaab65a54210734664cc541e&autoload=false`}
					defer
				></script>
				<Script
					src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
					strategy="beforeInteractive"
				/>
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
