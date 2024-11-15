import { FC, useCallback, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

const CurrentLocationButton: FC<CenterButtonProps> = ({ map }) => {
	const [currentLocation, setCurrentLocation] = useState<
		[number, number] | null
	>(null);
	const watchId = useRef<number | null>(null);
	const locationMarker = useRef<mapboxgl.Marker | null>(null);

	const updateMarker = useCallback(
		(lngLat: [number, number]) => {
			if (!map) return;

			if (!locationMarker.current) {
				const el = document.createElement('div');
				el.className = 'current-location-marker';
				el.style.width = '30px';
				el.style.height = '30px';
				el.style.backgroundImage = 'url(/maskable_icon_x192.png)';
				el.style.backgroundSize = 'cover';
				el.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';

				locationMarker.current = new mapboxgl.Marker(el)
					.setLngLat(lngLat)
					.addTo(map);
			} else {
				locationMarker.current.setLngLat(lngLat);
			}
		},
		[map],
	);

	useEffect(() => {
		if (navigator.geolocation && map) {
			navigator.geolocation.getCurrentPosition(
				position => {
					const { latitude, longitude } = position.coords;
					const newLocation: [number, number] = [longitude, latitude];
					setCurrentLocation(newLocation);
					updateMarker(newLocation);
				},
				error => {
					console.error('현재 위치 받아오는 중 오류 발생:', error);
				},
			);

			watchId.current = navigator.geolocation.watchPosition(
				position => {
					const { latitude, longitude } = position.coords;
					const newLocation: [number, number] = [longitude, latitude];
					setCurrentLocation(newLocation);
					updateMarker(newLocation);
				},
				error => {
					console.error('위치 변화 감지 중 오류 발생:', error);
				},
				{
					enableHighAccuracy: true,
					timeout: 5000,
					maximumAge: 0,
				},
			);
		}

		return () => {
			if (watchId.current !== null) {
				navigator.geolocation.clearWatch(watchId.current);
			}
			if (locationMarker.current) {
				locationMarker.current.remove();
			}
		};
	}, [map, updateMarker]);

	const centerMapOnLocation = () => {
		if (map && currentLocation) {
			map.flyTo({
				center: currentLocation,
				zoom: 18,
				duration: 3000,
			});
		}
	};

	return (
		<button
			onClick={centerMapOnLocation}
			className="absolute bottom-[30%] right-[1px] -translate-x-1/2 z-10 bg-white border-none p-2.5 cursor-pointer rounded-lg"
		>
			현재 위치로
		</button>
	);
};

export default CurrentLocationButton;
