import { useEffect, useRef, useState } from 'react';

const Map = () => {
	const mapRef = useRef<HTMLDivElement>(null);
	const [map, setMap] = useState<any>(null);
	const [marker, setMarker] = useState<any>(null);

	useEffect(() => {
		const initMap = async () => {
			if (window && (window as any).kakao) {
				const kakao = (window as any).kakao;

				kakao.maps.load(() => {
					if (mapRef.current) {
						const initialCenter = new kakao.maps.LatLng(37.5665, 126.978);
						const mapInstance = new kakao.maps.Map(mapRef.current, {
							center: initialCenter,
							level: 3,
						});

						const customIconSrc = '/choki192x192.png';
						const customIconSize = new kakao.maps.Size(32, 32);
						const customIcon = new kakao.maps.MarkerImage(
							customIconSrc,
							customIconSize,
						);

						const initialMarker = new kakao.maps.Marker({
							position: initialCenter,
							image: customIcon,
							map: mapInstance,
						});

						setMap(mapInstance);
						setMarker(initialMarker);

						if (navigator.geolocation) {
							navigator.geolocation.watchPosition(
								position => {
									const { latitude, longitude } = position.coords;
									const newCenter = new kakao.maps.LatLng(latitude, longitude);

									mapInstance.setCenter(newCenter);
									initialMarker.setPosition(newCenter);
								},
								error => {
									console.error('Error watching position:', error);
								},
								{
									enableHighAccuracy: true,
									timeout: 5000,
									maximumAge: 0,
								},
							);
						} else {
							console.error('Geolocation is not supported by this browser.');
						}
					}
				});
			}
		};

		initMap();
	}, []);

	return <div ref={mapRef} style={{ width: '100%', height: '100vh' }} />;
};

export default Map;
