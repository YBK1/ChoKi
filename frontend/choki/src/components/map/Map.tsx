// components/Map.tsx
import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import RouteRecorder from './RouteRecorder';

const Map = () => {
	const mapRef = useRef<HTMLDivElement>(null);
	const [mapInstance, setMapInstance] = useState<any>(null);
	const [polyline, setPolyline] = useState<any>(null);
	const [finalRoute, setFinalRoute] = useState<{ lat: number; lng: number }[]>(
		[],
	);

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
					setMapInstance(map);
					navigator.geolocation.getCurrentPosition(
						position => {
							const { latitude, longitude } = position.coords;
							const userLocation = new kakao.maps.LatLng(latitude, longitude);
							map.setCenter(userLocation);
							const markerImage = new kakao.maps.MarkerImage(
								'/choki192x192.png',
								new kakao.maps.Size(30, 30),
								{ offset: new kakao.maps.Point(25, 50) },
							);

							const marker = new kakao.maps.Marker({
								position: userLocation,
								image: markerImage,
							});

							marker.setMap(map);
						},
						error => {
							console.error('유저 위치 가져오는 중 오류:', error);
						},
						{ enableHighAccuracy: true },
					);
				}
			});
		}
	}, []);

	useEffect(() => {
		if (mapInstance && finalRoute.length > 0) {
			const kakao = (window as any).kakao;

			const path = finalRoute.map(
				point => new kakao.maps.LatLng(point.lat, point.lng),
			);

			if (polyline) {
				polyline.setMap(null);
			}

			const newPolyline = new kakao.maps.Polyline({
				path: path,
				strokeWeight: 5,
				strokeColor: '#FF0000',
				strokeOpacity: 0.7,
				strokeStyle: 'solid',
			});

			newPolyline.setMap(mapInstance);
			setPolyline(newPolyline);

			// Pan to the latest position
			if (path.length > 0) {
				mapInstance.panTo(path[path.length - 1]);
			}
		}
	}, [finalRoute, mapInstance]);

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
			<div
				style={{
					position: 'absolute',
					bottom: '10px',
					left: '50%',
					transform: 'translateX(-50%)',
					zIndex: 10,
					padding: '10px',
					borderRadius: '5px',
				}}
			>
				<RouteRecorder setFinalRoute={setFinalRoute} />
			</div>
		</div>
	);
};

export default Map;
