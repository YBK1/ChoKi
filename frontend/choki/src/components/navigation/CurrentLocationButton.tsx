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
				wrapper.style.width = '80px';
				wrapper.style.height = '80px';
				wrapper.style.display = 'flex';
				wrapper.style.justifyContent = 'center';
				wrapper.style.alignItems = 'center';

				const arrowContainer = document.createElement('div');
				arrowContainer.style.position = 'absolute';
				arrowContainer.style.width = '100%';
				arrowContainer.style.height = '100%';
				arrowContainer.style.display = 'flex';
				arrowContainer.style.justifyContent = 'center';
				arrowContainer.style.alignItems = 'center';

				const arrow = document.createElement('div');
				arrow.className = 'direction-arrow';
				arrow.style.width = '24px';
				arrow.style.height = '24px';
				arrow.style.position = 'absolute';
				arrow.style.backgroundImage = 'url(/icons/direction_arrow.svg)';
				arrow.style.backgroundSize = 'contain';
				arrow.style.backgroundRepeat = 'no-repeat';
				arrow.style.backgroundPosition = 'center';
				arrow.style.transition = 'transform 0.3s ease-out';
				arrow.style.transformOrigin = 'center';

				const dog = document.createElement('div');
				dog.style.width = '30px';
				dog.style.height = '30px';
				dog.style.position = 'absolute';
				dog.style.backgroundImage = 'url(/icons/dog_character.svg)';
				dog.style.backgroundSize = 'contain';
				dog.style.backgroundRepeat = 'no-repeat';
				dog.style.backgroundPosition = 'center';
				dog.style.zIndex = '1';

				arrowContainer.appendChild(arrow);
				wrapper.appendChild(arrowContainer);
				wrapper.appendChild(dog);

				locationMarker.current = new mapboxgl.Marker({
					element: wrapper,
					rotationAlignment: 'map',
					pitchAlignment: 'viewport',
					anchor: 'center',
				})
					.setLngLat(lngLat)
					.addTo(map);
			} else {
				locationMarker.current.setLngLat(lngLat);
			}

			if (locationMarker.current && direction !== null) {
				const arrow = locationMarker.current
					.getElement()
					.querySelector('.direction-arrow') as HTMLElement;
				if (arrow) {
					const radius = 25;
					const angleRad = (direction * Math.PI) / 180;

					arrow.style.transform = `
            translate(${radius * Math.sin(angleRad)}px, ${-radius * Math.cos(angleRad)}px)
            rotate(${direction}deg)
          `;
				}
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
