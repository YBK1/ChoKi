import { FC, useCallback, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import useCompass from './useCompass';

const CurrentLocationButton: FC<CenterButtonProps> = ({ map }) => {
	const [currentLocation, setCurrentLocation] = useState<
		[number, number] | null
	>(null);
	const watchId = useRef<number | null>(null);
	const locationMarker = useRef<mapboxgl.Marker | null>(null);

	const { direction } = useCompass();

	const updateMarker = useCallback(
		(lngLat: [number, number]) => {
			if (!map) return;

			if (!locationMarker.current) {
				const wrapper = document.createElement('div');
				wrapper.className = 'current-location-marker';
				wrapper.style.position = 'relative';
				wrapper.style.width = '60px';
				wrapper.style.height = '60px';

				const dog = document.createElement('div');
				dog.style.top = '50%';
				dog.style.left = '50%';
				dog.style.width = '30px';
				dog.style.height = '30px';
				dog.style.position = 'absolute';
				dog.style.transform = 'translate(-50%, -50%)';
				dog.style.backgroundImage = 'url(/icons/dog_character.svg)';
				dog.style.backgroundSize = 'cover';

				const arrow = document.createElement('div');
				arrow.style.width = '30px';
				arrow.style.height = '30px';
				arrow.style.position = 'absolute';
				arrow.style.backgroundImage = 'url(/icons/direction_arrow.svg)';
				arrow.style.backgroundSize = 'cover';
				// arrow.style.top = '0';
				// arrow.style.left = '50%';
				// arrow.style.transform = `translateX(-50%) rotate(${direction}deg)`;
				arrow.style.transition = 'left 0.2s ease-out, top 0.2s ease-out';

				wrapper.appendChild(arrow);
				wrapper.appendChild(dog);

				locationMarker.current = new mapboxgl.Marker(wrapper)
					.setLngLat(lngLat)
					.addTo(map);
			} else {
				locationMarker.current.setLngLat(lngLat);

				console.log(direction);

				const arrowElement = locationMarker.current.getElement()
					.children[0] as HTMLElement;
				const radius = 40;
				const radian = (direction * Math.PI) / 180;
				const xOffset = radius * Math.sin(radian);
				const yOffset = radius * Math.cos(radian);
				arrowElement.style.left = `calc(50% + ${xOffset - 15}px)`;
				arrowElement.style.top = `calc(50% - ${yOffset + 10}px)`;
			}
		},
		[map, direction],
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
