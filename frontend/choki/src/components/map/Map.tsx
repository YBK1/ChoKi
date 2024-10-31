import { useEffect, useRef } from 'react';

const KAKAO_API_KEY = 'YOUR_APP_KEY'; // Replace with your actual Kakao API key

const Map = () => {
	const mapRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Load the Kakao Maps script and initialize the map
		if (window && (window as any).kakao) {
			const kakao = (window as any).kakao;

			// Initialize the Kakao Maps library
			kakao.maps.load(() => {
				if (mapRef.current) {
					const map = new kakao.maps.Map(mapRef.current, {
						center: new kakao.maps.LatLng(37.5665, 126.978), // Default center (Seoul)
						level: 3, // Zoom level
					});

					// You can add markers or other map features here
					new kakao.maps.Marker({
						position: new kakao.maps.LatLng(37.5665, 126.978),
						map: map,
					});
				}
			});
		}
	}, []);

	return <div ref={mapRef} style={{ width: '100%', height: '100vh' }} />;
};

export default Map;
