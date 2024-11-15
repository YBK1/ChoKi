import { useEffect } from 'react';

interface UserLocationMarkerProps {
	map: any;
	coordinates?: { latitude: number; longitude: number } | null;
	nearbyUsers?: NearbyUserData | null;
}

const UserLocationMarker = ({
	map,
	coordinates,
	nearbyUsers,
}: UserLocationMarkerProps) => {
	useEffect(() => {
		if (!map || !navigator.geolocation) {
			console.error('위치 및 지도 오류');
			return;
		}

		const kakao = (window as any).kakao;

		// 기본값
		const defaultMarkerImage = new kakao.maps.MarkerImage(
			'/icons/dog_character.svg',
			new kakao.maps.Size(30, 30),
			{ offset: new kakao.maps.Point(15, 30) },
		);
		const mainMarker = new kakao.maps.Marker({
			image: defaultMarkerImage,
			map,
		});

		const updateMarkerPosition = (latitude: number, longitude: number) => {
			const location = new kakao.maps.LatLng(latitude, longitude);
			mainMarker.setPosition(location);
			map.setCenter(location);
		};

		// 주변 유저 데이터 있을 경우
		if (nearbyUsers) {
			const animalMarkerImage = new kakao.maps.MarkerImage(
				nearbyUsers.animalImage,
				new kakao.maps.Size(60, 60),
				{ offset: new kakao.maps.Point(30, 60) },
			);
			mainMarker.setImage(animalMarkerImage);

			// 본인 기준으로 중심
			updateMarkerPosition(nearbyUsers.latitude, nearbyUsers.longitude);

			// 주변 사람들
			nearbyUsers.users.forEach(user => {
				const userLocation = new kakao.maps.LatLng(
					user.latitude,
					user.longitude,
				);
				new kakao.maps.Marker({
					position: userLocation,
					map: map,
					image: new kakao.maps.MarkerImage(
						user.animalImage,
						new kakao.maps.Size(30, 30),
						{ offset: new kakao.maps.Point(15, 30) },
					),
				});
			});
		} else {
			// 웹소켓 좌표 주어지면 해당 좌표 기반으로 위치 업데이트
			if (coordinates) {
				console.log('웹소켓 좌표 위치 사용:', coordinates);
				updateMarkerPosition(coordinates.latitude, coordinates.longitude);
			} else {
				// 웹소켓 좌표 없으면 현재 위치
				const watchId = navigator.geolocation.watchPosition(
					position => {
						const { latitude, longitude } = position.coords;
						console.log('현재 위치 사용:', latitude, longitude);
						updateMarkerPosition(latitude, longitude);
					},
					error => {
						console.error('현재 위치 가져오는 중 오류:', error);
					},
					{ enableHighAccuracy: true },
				);

				return () => navigator.geolocation.clearWatch(watchId);
			}
		}

		return () => mainMarker.setMap(null);
	}, [map, coordinates, nearbyUsers]);

	return null;
};

export default UserLocationMarker;
