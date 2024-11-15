import { useEffect } from 'react';

const UserLocationMarker = ({ map, coordinates }: UserLocationMarkerProps) => {
	useEffect(() => {
		if (!map || !navigator.geolocation) {
			console.error('위치 및 지도 오류');
			return;
		}

		const kakao = (window as any).kakao;

		const markerImage = new kakao.maps.MarkerImage(
			'/maskable_icon_x192.png',
			new kakao.maps.Size(30, 30),
			{ offset: new kakao.maps.Point(15, 30) },
		);
		const marker = new kakao.maps.Marker({ image: markerImage, map });

		const updateMarkerPosition = (latitude: number, longitude: number) => {
			const location = new kakao.maps.LatLng(latitude, longitude);
			marker.setPosition(location);
			map.setCenter(location);
		};

		const watchId = navigator.geolocation.watchPosition(
			position => {
				const { latitude, longitude } = position.coords;
				if (!coordinates) {
					console.log('현재 위치 사용:', latitude, longitude);
					updateMarkerPosition(latitude, longitude);
				}
			},
			error => {
				console.error('현재 위치 가져오는 중 오류:', error);
			},
			{ enableHighAccuracy: true },
		);

		if (coordinates) {
			console.log('웹소켓 좌표 위치 사용:', coordinates);
			updateMarkerPosition(coordinates.latitude, coordinates.longitude);
		}

		return () => {
			marker.setMap(null);
			navigator.geolocation.clearWatch(watchId);
		};
	}, [map, coordinates]);

	return null;
};

export default UserLocationMarker;
