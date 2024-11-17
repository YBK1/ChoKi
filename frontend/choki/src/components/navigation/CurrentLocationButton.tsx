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

	// Handle device orientation changes
	const handleDeviceOrientation = useCallback(
		(event: DeviceOrientationEvent) => {
			const webkitCompassHeading = (event as any).webkitCompassHeading;
			let compassHeading = 0;

			if (webkitCompassHeading !== undefined) {
				// Use iOS-specific compass heading
				compassHeading = webkitCompassHeading;
			} else if (event.alpha !== null) {
				// Use alpha for other devices
				compassHeading = (event.alpha + 360) % 360; // Normalize to 0-360 degrees
			}

			setDeviceDirection(compassHeading);
		},
		[],
	);

	// Request permission for device orientation on iOS
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
					console.error('Device orientation permission denied.');
				}
			} catch (error) {
				console.error('Error requesting device orientation permission:', error);
			}
		} else {
			// Non-iOS devices or devices that don't require explicit permission
			window.addEventListener('deviceorientation', handleDeviceOrientation);
		}
	}, [handleDeviceOrientation]);

	const add3DMarker = useCallback(
		(lngLat: [number, number]) => {
			if (!map) return;

			if (map.getLayer('current-location-marker')) {
				map.removeLayer('current-location-marker');
			}
			if (map.getSource('current-location-marker')) {
				map.removeSource('current-location-marker');
			}

			map.addSource('current-location-marker', {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: [
						{
							type: 'Feature',
							geometry: {
								type: 'Point',
								coordinates: lngLat,
							},
							properties: {},
						},
					],
				},
			});

			map.addLayer({
				id: 'current-location-marker',
				type: 'symbol',
				source: 'current-location-marker',
				layout: {
					'icon-image': 'custom-marker',
					'icon-size': 1.5,
					'icon-pitch-alignment': 'map',
					'icon-rotation-alignment': 'map',
					'icon-rotate': deviceDirection, // Rotate marker based on device heading
				},
			});
		},
		[map, deviceDirection],
	);

	useEffect(() => {
		if (!map) return;

		const geolocateControl = new mapboxgl.GeolocateControl({
			positionOptions: {
				enableHighAccuracy: true,
			},
			trackUserLocation: true,
			showUserHeading: true,
		});

		map.addControl(geolocateControl);

		geolocateControl.on('geolocate', () => {
			const accuracyCircle = document.querySelector(
				'.mapboxgl-user-location-accuracy-circle',
			);
			if (accuracyCircle) {
				accuracyCircle.remove();
			}
		});

		geolocateControl.on('geolocate', position => {
			const { latitude, longitude } = position.coords;
			setCurrentLocation([longitude, latitude]);

			map.flyTo({
				center: [longitude, latitude],
				zoom: 18,
				pitch: 60,
				bearing: 0,
				speed: 1.5,
			});

			add3DMarker([longitude, latitude]);
		});

		setTimeout(() => {
			geolocateControl.trigger();
		}, 1000);

		requestDeviceOrientationPermission();

		return () => {
			map.removeControl(geolocateControl);
			window.removeEventListener('deviceorientation', handleDeviceOrientation);
		};
	}, [
		map,
		add3DMarker,
		requestDeviceOrientationPermission,
		handleDeviceOrientation,
	]);

	const centerMapOnLocation = () => {
		if (map && currentLocation) {
			map.flyTo({
				center: currentLocation,
				zoom: 18,
				pitch: 60,
				bearing: 0,
				duration: 3000,
			});
		}
	};

	return (
		<button
			onClick={centerMapOnLocation}
			className="absolute bottom-40 right-4 bg-white border-none p-2.5 cursor-pointer rounded-lg shadow-md z-10"
		>
			현재 위치로
		</button>
	);
};

export default CurrentLocationButton;
