import { FC, useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';

interface CenterButtonProps {
	map: mapboxgl.Map | null;
}

const CurrentLocationButton: FC<CenterButtonProps> = ({ map }) => {
	const [currentLocation, setCurrentLocation] = useState<
		[number, number] | null
	>(null);
	const [deviceDirection, setDeviceDirection] = useState<number>(0);
	const [isCompassAvailable, setIsCompassAvailable] = useState<boolean>(false);

	const handleDeviceOrientation = useCallback(
		(event: DeviceOrientationEvent) => {
			const webkitCompassHeading = (event as any).webkitCompassHeading;
			let compassHeading = 0;

			if (webkitCompassHeading !== undefined) {
				compassHeading = webkitCompassHeading;
				setIsCompassAvailable(true);
			} else if (event.alpha !== null) {
				compassHeading = 360 - event.alpha!;
				setIsCompassAvailable(true);
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
					window.addEventListener(
						'deviceorientation',
						handleDeviceOrientation,
						true,
					);
					setIsCompassAvailable(true);
				} else {
					console.error('Compass permission denied');
					setIsCompassAvailable(false);
				}
			} catch (error) {
				console.error('Error requesting compass permission:', error);
				setIsCompassAvailable(false);
			}
		} else {
			window.addEventListener(
				'deviceorientation',
				handleDeviceOrientation,
				true,
			);
		}
	}, [handleDeviceOrientation]);

	useEffect(() => {
		if (!map) return;

		const geolocateControl = new mapboxgl.GeolocateControl({
			positionOptions: {
				enableHighAccuracy: true,
			},
			trackUserLocation: true,
			showUserHeading: true, // This will show the direction indicator
			showAccuracyCircle: false, // Optional: hide accuracy circle
		});

		map.addControl(geolocateControl);

		requestDeviceOrientationPermission();

		geolocateControl.on('geolocate', (position: GeolocationPosition) => {
			const { longitude, latitude } = position.coords;
			setCurrentLocation([longitude, latitude]);
		});

		const timeoutId = setTimeout(() => {
			geolocateControl.trigger();
		}, 1000);

		return () => {
			clearTimeout(timeoutId);
			map.removeControl(geolocateControl);
			window.removeEventListener(
				'deviceorientation',
				handleDeviceOrientation,
				true,
			);
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
		<>
			<button
				onClick={centerMapOnLocation}
				className="absolute bottom-40 right-4 bg-white border-none p-2.5 cursor-pointer rounded-lg shadow-md z-10 flex items-center justify-center"
				disabled={!currentLocation}
			></button>
			{!isCompassAvailable && (
				<div className="absolute bottom-48 right-4 bg-white p-2 rounded-lg shadow-md z-10 text-sm">
					나침반을 사용할 수 없습니다
				</div>
			)}
		</>
	);
};

export default CurrentLocationButton;
