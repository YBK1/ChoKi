import { FC, useCallback, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
	requestPermission?: () => Promise<'granted' | 'denied'>;
}

interface DeviceOrientationEventWithWebkit extends DeviceOrientationEvent {
	webkitCompassHeading?: number;
}

const CurrentLocationButton: FC<CenterButtonProps> = ({ map }) => {
	const [currentLocation, setCurrentLocation] = useState<
		[number, number] | null
	>(null);
	const [deviceDirection, setDeviceDirection] = useState<number>(0);
	const watchId = useRef<number | null>(null);
	const locationMarker = useRef<mapboxgl.Marker | null>(null);

	useEffect(() => {
		const handleOrientation = (event: DeviceOrientationEvent) => {
			const eventWithWebkit = event as DeviceOrientationEventWithWebkit;

			// iOS devices
			if (eventWithWebkit.webkitCompassHeading) {
				const compassHeading = eventWithWebkit.webkitCompassHeading;
				console.log('Compass heading:', compassHeading);
				setDeviceDirection(compassHeading);
			}
			// Android devices
			else if (event.alpha !== null) {
				let heading = event.alpha;

				if (event.beta !== null && event.gamma !== null) {
					// Adjust for screen orientation
					if (typeof window.orientation !== 'undefined') {
						switch (window.orientation) {
							case 0:
								heading = event.alpha;
								break;
							case 90:
								heading = event.alpha + 90;
								break;
							case -90:
								heading = event.alpha - 90;
								break;
							case 180:
								heading = event.alpha + 180;
								break;
						}
					}

					// Normalize to 0-360
					heading = (heading + 360) % 360;
				}

				console.log('Calculated heading:', heading);
				setDeviceDirection(heading);
			}
		};

		const requestOrientationPermission = async () => {
			try {
				// Try absolute orientation first
				window.addEventListener('deviceorientationabsolute', handleOrientation);
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (e) {
				console.log(
					'Absolute orientation not available, trying regular orientation',
				);
				window.addEventListener('deviceorientation', handleOrientation);
			}

			// For iOS devices
			const requestPermissionFunc = (
				DeviceOrientationEvent as unknown as DeviceOrientationEventiOS
			).requestPermission;

			if (
				requestPermissionFunc &&
				typeof requestPermissionFunc === 'function'
			) {
				try {
					const permission = await requestPermissionFunc();
					if (permission === 'granted') {
						window.addEventListener('deviceorientation', handleOrientation);
					}
				} catch (error) {
					console.error('Permission denied:', error);
				}
			} else {
				// Non-iOS devices don't need permission
				window.addEventListener('deviceorientation', handleOrientation);
			}
		};

		requestOrientationPermission();

		return () => {
			window.removeEventListener(
				'deviceorientationabsolute',
				handleOrientation,
			);
			window.removeEventListener('deviceorientation', handleOrientation);
		};
	}, []);

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

				// Simple direction pointer
				const pointer = document.createElement('div');
				pointer.style.width = '0';
				pointer.style.height = '0';
				pointer.style.borderLeft = '8px solid transparent';
				pointer.style.borderRight = '8px solid transparent';
				pointer.style.borderBottom = '16px solid red';
				pointer.style.position = 'absolute';
				pointer.style.top = '0';
				pointer.style.transformOrigin = 'bottom center';
				pointer.style.transition = 'transform 0.3s ease-out';

				const dog = document.createElement('div');
				dog.style.width = '30px';
				dog.style.height = '30px';
				dog.style.position = 'absolute';
				dog.style.backgroundImage = 'url(/icons/dog_character.svg)';
				dog.style.backgroundSize = 'contain';
				dog.style.backgroundRepeat = 'no-repeat';
				dog.style.backgroundPosition = 'center';
				dog.style.zIndex = '1';

				wrapper.appendChild(pointer);
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

			// Update direction pointer
			if (locationMarker.current) {
				const pointer = locationMarker.current
					.getElement()
					.querySelector('div') as HTMLElement;
				if (pointer) {
					pointer.style.transform = `rotate(${deviceDirection}deg)`;
				}
			}
		},
		[map, deviceDirection],
	);

	// Rest of your code remains the same
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
					console.log('위치 변화 감지:', position.coords);
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
