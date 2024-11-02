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

	// Function to calculate if the location has significantly changed
	const hasLocationChangedSignificantly = (
		oldLat: number,
		oldLng: number,
		newLat: number,
		newLng: number,
	) => {
		// Calculate distance using Haversine formula (in meters)
		const R = 6371e3; // Earth's radius in meters
		const φ1 = (oldLat * Math.PI) / 180;
		const φ2 = (newLat * Math.PI) / 180;
		const Δφ = ((newLat - oldLat) * Math.PI) / 180;
		const Δλ = ((newLng - oldLng) * Math.PI) / 180;

		const a =
			Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
			Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		const distance = R * c;

		// Only update if location has changed by more than 10 meters
		return distance > 10;
	};

	// Function to create or update marker
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
				// Update existing marker
				locationMarker.current.setLngLat(lngLat);
			}
		},
		[map],
	);

	// Start watching location when component mounts
	useEffect(() => {
		if (navigator.geolocation && map) {
			watchId.current = navigator.geolocation.watchPosition(
				position => {
					const { latitude, longitude } = position.coords;
					const newLocation: [number, number] = [longitude, latitude];

					// Only update if location has changed significantly
					if (
						!currentLocation ||
						hasLocationChangedSignificantly(
							currentLocation[1],
							currentLocation[0],
							latitude,
							longitude,
						)
					) {
						setCurrentLocation(newLocation);
						updateMarker(newLocation);
					}
				},
				error => {
					console.error('Error getting location:', error);
				},
				{
					enableHighAccuracy: true,
					timeout: 15000,
					maximumAge: 10000, // Cache locations for 10 seconds
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
	}, [map, currentLocation, updateMarker]);

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
			style={{
				position: 'absolute',
				bottom: '30%',
				right: '1px',
				transform: 'translateX(-50%)',
				zIndex: 1,
				backgroundColor: '#fff',
				border: 'none',
				padding: '10px',
				cursor: 'pointer',
				borderRadius: '8px',
			}}
		>
			현재 위치로
		</button>
	);
};

export default CurrentLocationButton;
