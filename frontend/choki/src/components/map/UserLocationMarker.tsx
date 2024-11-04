import { useEffect } from 'react';

type UserLocationMarkerProps = {
	map: any;
};

const UserLocationMarker = ({ map }: UserLocationMarkerProps) => {
	useEffect(() => {
		if (!map || !navigator.geolocation) {
			console.error('위치 및 지도 오류');
			return;
		}

		const kakao = (window as any).kakao;

		const markerImage = new kakao.maps.MarkerImage(
			'/choki192x192.png',
			new kakao.maps.Size(30, 30),
			{ offset: new kakao.maps.Point(15, 30) },
		);
		const marker = new kakao.maps.Marker({ image: markerImage, map });

		const watchId = navigator.geolocation.watchPosition(
			position => {
				const { latitude, longitude } = position.coords;
				const userLocation = new kakao.maps.LatLng(latitude, longitude);

				marker.setPosition(userLocation);
				map.setCenter(userLocation);
			},
			error => {
				console.error('현재 위치 가져오는 중 오류:', error);
			},
			{ enableHighAccuracy: true },
		);

		return () => {
			navigator.geolocation.clearWatch(watchId);
		};
	}, [map]);

	return null;
};

export default UserLocationMarker;
