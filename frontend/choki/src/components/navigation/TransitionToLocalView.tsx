import { useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import SkyLayer from './SkyLayer';
import ThreeDBuildingsLayer from './3DBuildingsLayer';
import MapStyles from './MapStyles';

interface TransitionToLocalViewProps {
	map: mapboxgl.Map | null;
	userLocation: [number, number] | null;
	setIsGlobeView: (value: boolean) => void;
}

const TransitionToLocalView: React.FC<TransitionToLocalViewProps> = ({
	map,
	userLocation,
	setIsGlobeView,
}) => {
	const transitionToLocalView = useCallback(() => {
		if (!map || !userLocation) return;

		setIsGlobeView(false);

		map.flyTo({
			center: userLocation,
			zoom: 3,
			duration: 2000,
			pitch: 0,
			bearing: 0,
		});

		setTimeout(() => {
			map.setProjection({ name: 'mercator' });
			map.setStyle('mapbox://styles/mapbox/streets-v11');

			map.once('style.load', () => {
				const style = map.getStyle();
				if (style && style.layers) {
					style.layers.forEach(layer => {
						if (
							layer.type === 'symbol' &&
							layer.layout &&
							'text-field' in layer.layout
						) {
							map.setLayoutProperty(layer.id, 'text-field', [
								'coalesce',
								['get', 'name_ko'],
								['get', 'name'],
							]);
						}
					});
				}

				// Fly to user's location with a zoomed-in view
				map.flyTo({
					center: userLocation,
					zoom: 18,
					pitch: 75,
					duration: 3000,
					essential: true,
				});

				// Load and add the dotted line route
				map.loadImage(
					'https://docs.mapbox.com/mapbox-gl-js/assets/pattern-dot.png',
					(error, image) => {
						if (error || !image) {
							console.error('Error loading pattern image:', error);
							return;
						}

						if (!map.hasImage('pattern-dot')) {
							map.addImage('pattern-dot', image);
						}

						// Add the GeoJSON source for the route
						map.addSource('route-data', {
							type: 'geojson',
							data: {
								type: 'Feature',
								properties: {},
								geometry: {
									type: 'LineString',
									coordinates: [
										[126.8124, 35.2014], // 국가대표짬뽕 수완본점
										[126.8189, 35.1976], // Intermediate Point
										[126.8235, 35.1941], // Intermediate Point
										[126.8271, 35.1898], // Intermediate Point
										[126.8334, 35.1808], // Intermediate Point
										[126.8463, 35.1711], // 광주송정역
									],
								},
							},
						});

						// Add the line layer with the dotted pattern
						map.addLayer({
							id: 'dotted-route-line',
							type: 'line',
							source: 'route-data',
							layout: {
								'line-join': 'round',
								'line-cap': 'round',
							},
							paint: {
								'line-pattern': 'pattern-dot',
								'line-width': 10,
							},
						});

						// Apply additional map layers
						SkyLayer(map);
						ThreeDBuildingsLayer(map);
						MapStyles(map);
					},
				);
			});
		}, 2500);
	}, [map, userLocation, setIsGlobeView]);

	return (
		<button
			onClick={transitionToLocalView}
			disabled={!userLocation}
			className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        px-6 py-3 bg-white rounded-lg shadow-lg
        text-lg font-semibold
        transition-all duration-300
        ${!userLocation ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 active:bg-gray-100'}
      `}
		>
			{userLocation ? '시작하기' : '위치 확인 중...'}
		</button>
	);
};

export default TransitionToLocalView;
