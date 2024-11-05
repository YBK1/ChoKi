// components/MapContainer.tsx
import { useEffect, useRef } from 'react';
import Script from 'next/script';

const MapContainer = ({ onMapLoad }: MapContainerProps) => {
	const mapRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (window && (window as any).kakao) {
			const kakao = (window as any).kakao;
			kakao.maps.load(() => {
				if (mapRef.current) {
					const center = new kakao.maps.LatLng(37.5665, 126.978);
					const map = new kakao.maps.Map(mapRef.current, {
						center: center,
						level: 4,
					});

					map.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);
					onMapLoad(map);
				}
			});
		}
	}, [onMapLoad]);

	return (
		<div style={{ height: '100vh', width: '100%' }}>
			<Script
				src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=20b43e8fdaab65a54210734664cc541e&autoload=false"
				strategy="lazyOnload"
				onLoad={() => {
					if (window && (window as any).Kakao) {
						(window as any).Kakao.init('20b43e8fdaab65a54210734664cc541e');
					}
				}}
			/>
			<div ref={mapRef} style={{ width: '100%', height: '100%' }} />
		</div>
	);
};

export default MapContainer;
