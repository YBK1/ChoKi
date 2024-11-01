import { useEffect, useRef } from 'react';

const MapComponent = ({ onMapLoad }: { onMapLoad: (map: any) => void }) => {
	const mapRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (window && (window as any).kakao) {
			const kakao = (window as any).kakao;

			kakao.maps.load(() => {
				if (mapRef.current) {
					const initialCenter = new kakao.maps.LatLng(37.5665, 126.978);
					const mapInstance = new kakao.maps.Map(mapRef.current, {
						center: initialCenter,
						level: 3,
					});

					onMapLoad(mapInstance);
				}
			});
		}
	}, [onMapLoad]);

	return <div ref={mapRef} style={{ width: '100%', height: '100vh' }} />;
};

export default MapComponent;
