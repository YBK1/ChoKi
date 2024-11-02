import { FC, useCallback, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

interface CenterButtonProps {
	map: mapboxgl.Map | null;
}

const CurrentLocationButton: FC<CenterButtonProps> = ({ map }) => {
	const [currentLocation, setCurrentLocation] = useState<
		[number, number] | null
	>(null);
	const watchId = useRef<number | null>(null);
	const locationMarker = useRef<mapboxgl.Marker | null>(null);

	// Create or update marker
	const updateMarker = useCallback(
		(lngLat: [number, number]) => {
			if (!map) return;

			if (!locationMarker.current) {
				// Create a custom marker element
				const el = document.createElement('div');
				el.className = 'current-location-marker';
				el.style.width = '20px';
				el.style.height = '20px';
				el.style.borderRadius = '50%';
				el.style.backgroundColor = '#4A90E2';
				el.style.border = '3px solid white';
				el.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';

				// Create new marker
				locationMarker.current = new mapboxgl.Marker(el)
					.setLngLat(lngLat)
					.addTo(map);
			} else {
				// Update existing marker position
				locationMarker.current.setLngLat(lngLat);
			}
		},
		[map],
	);

	// Start watching location when component mounts
	useEffect(() => {
		if (navigator.geolocation && map) {
			// Get initial position immediately
			navigator.geolocation.getCurrentPosition(
				position => {
					const { latitude, longitude } = position.coords;
					const newLocation: [number, number] = [longitude, latitude];
					setCurrentLocation(newLocation);
					updateMarker(newLocation);
				},
				error => {
					console.error('Error getting initial location:', error);
				},
			);

			// Then start watching for position changes
			watchId.current = navigator.geolocation.watchPosition(
				position => {
					const { latitude, longitude } = position.coords;
					const newLocation: [number, number] = [longitude, latitude];
					setCurrentLocation(newLocation);
					updateMarker(newLocation);
				},
				error => {
					console.error('Error watching location:', error);
				},
				{
					enableHighAccuracy: true,
					timeout: 5000,
					maximumAge: 0, // Don't use cached positions
				},
			);
		}

		// Cleanup
		return () => {
			if (watchId.current !== null) {
				navigator.geolocation.clearWatch(watchId.current);
			}
			if (locationMarker.current) {
				locationMarker.current.remove();
			}
		};
	}, [map, updateMarker]); // Remove currentLocation from dependencies

	const centerMapOnLocation = () => {
		if (map && currentLocation) {
			map.flyTo({
				center: currentLocation,
				zoom: 18,
				duration: 1000,
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
