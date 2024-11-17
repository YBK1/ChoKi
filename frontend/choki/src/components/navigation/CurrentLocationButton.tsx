import { FC, useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';

interface CenterButtonProps {
	map: mapboxgl.Map | null;
}

const CurrentLocationButton: FC<CenterButtonProps> = ({ map }) => {
	const [currentLocation, setCurrentLocation] = useState<
		[number, number] | null
	>(null);

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
				},
			});
		},
		[map],
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

		return () => {
			map.removeControl(geolocateControl);
		};
	}, [map, add3DMarker]);

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
