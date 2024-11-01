import { useEffect } from 'react';

const UserLocation = ({ map }: { map: any }) => {
	useEffect(() => {
		if (!map || !navigator.geolocation) {
			console.error('Map not loaded or Geolocation not supported');
			return;
		}

		const kakao = (window as any).kakao;
		const customIconSrc = '/choki192x192.png';
		const customIconSize = new kakao.maps.Size(32, 32);
		const customIcon = new kakao.maps.MarkerImage(
			customIconSrc,
			customIconSize,
		);
		const userMarker = new kakao.maps.Marker({ image: customIcon, map });

		navigator.geolocation.getCurrentPosition(
			position => {
				const { latitude, longitude } = position.coords;
				const userLocation = new kakao.maps.LatLng(latitude, longitude);
				map.setCenter(userLocation);
				userMarker.setPosition(userLocation);

				navigator.geolocation.watchPosition(
					pos => {
						const { latitude, longitude } = pos.coords;
						const newLocation = new kakao.maps.LatLng(latitude, longitude);
						map.setCenter(newLocation);
						userMarker.setPosition(newLocation);
					},
					error => {
						console.error('Error watching position:', error);
					},
					{
						enableHighAccuracy: true,
						timeout: 10000,
						maximumAge: 0,
					},
				);
			},
			error => {
				console.error('Error getting current location:', error);
			},
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 0,
			},
		);
	}, [map]);

	return null;
};

export default UserLocation;
