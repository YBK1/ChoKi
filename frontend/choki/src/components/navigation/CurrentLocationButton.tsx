import { FC, useEffect, useState, useCallback, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

interface CenterButtonProps {
	map: mapboxgl.Map | null;
}

const CurrentLocationButton: FC<CenterButtonProps> = ({ map }) => {
	const [currentLocation, setCurrentLocation] = useState<
		[number, number] | null
	>(null);
	const [deviceDirection, setDeviceDirection] = useState<number>(0);
	const geolocateControlRef = useRef<mapboxgl.GeolocateControl | null>(null);
	const cleanupRef = useRef(false);

	const handleDeviceOrientation = useCallback(
		(event: DeviceOrientationEvent) => {
			const webkitCompassHeading = (event as any).webkitCompassHeading;
			let compassHeading = 0;

			if (webkitCompassHeading !== undefined) {
				compassHeading = webkitCompassHeading;
			} else if (event.alpha !== null) {
				compassHeading = (360 - event.alpha + 360) % 360;
			}

			setDeviceDirection(compassHeading);
		},
		[],
	);

	const requestDeviceOrientationPermission = useCallback(async () => {
		if (
			typeof DeviceOrientationEvent !== 'undefined' &&
			typeof (DeviceOrientationEvent as any).requestPermission === 'function'
		) {
			try {
				const permission = await (
					DeviceOrientationEvent as any
				).requestPermission();
				if (permission === 'granted') {
					window.addEventListener('deviceorientation', handleDeviceOrientation);
				} else {
					console.error('Compass permission denied');
				}
			} catch (error) {
				console.error('Error requesting compass permission:', error);
			}
		} else {
			window.addEventListener('deviceorientation', handleDeviceOrientation);
		}
	}, [handleDeviceOrientation]);

	useEffect(() => {
		if (!map || cleanupRef.current) return;

		if (!geolocateControlRef.current) {
			const geolocateControl = new mapboxgl.GeolocateControl({
				positionOptions: {
					enableHighAccuracy: true,
				},
				trackUserLocation: true,
				showUserHeading: true,
				showAccuracyCircle: false,
			});

			geolocateControlRef.current = geolocateControl;
			map.addControl(geolocateControl);

			geolocateControl.on('geolocate', (position: GeolocationPosition) => {
				const { longitude, latitude } = position.coords;
				setCurrentLocation([longitude, latitude]);
			});

			requestDeviceOrientationPermission();

			setTimeout(() => {
				geolocateControl.trigger();
			}, 1000);
		}

		// Cleanup
		return () => {
			if (!cleanupRef.current && geolocateControlRef.current && map) {
				cleanupRef.current = true;
				try {
					map.removeControl(geolocateControlRef.current);
				} catch (error) {
					console.warn('Error removing geolocate control:', error);
				}
				geolocateControlRef.current = null;
				window.removeEventListener(
					'deviceorientation',
					handleDeviceOrientation,
				);
			}
		};
	}, [map, requestDeviceOrientationPermission, handleDeviceOrientation]);

	const centerMapOnLocation = useCallback(() => {
		if (map && currentLocation) {
			map.flyTo({
				center: currentLocation,
				zoom: 18,
				pitch: 60,
				bearing: deviceDirection,
				duration: 1000,
			});
		}
	}, [map, currentLocation, deviceDirection]);

	return (
		<button
			onClick={centerMapOnLocation}
			className="absolute bottom-40 right-4 bg-white border-none p-2.5 cursor-pointer rounded-lg shadow-md z-10 flex items-center justify-center"
			disabled={!currentLocation}
		>
			현재 위치로
		</button>
	);
};

export default CurrentLocationButton;
