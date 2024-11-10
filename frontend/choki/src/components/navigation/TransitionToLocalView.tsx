import { useCallback } from 'react';
import SkyLayer from './SkyLayer';
import ThreeDBuildingsLayer from './3DBuildingsLayer';
import MapStyles from './MapStyles';

const TransitionToLocalView: React.FC<TransitionToLocalViewProps> = ({
	map,
	userLocation,
	setIsGlobeView,
	route,
}) => {
	const transitionToLocalView = useCallback(() => {
		if (!map || !userLocation || !route) return;

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

				map.flyTo({
					center: userLocation,
					zoom: 18,
					pitch: 75,
					duration: 3000,
					essential: true,
				});

				const geojson: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
					type: 'FeatureCollection',
					features: [
						{
							type: 'Feature',
							properties: {},
							geometry: {
								type: 'LineString',
								coordinates: route.map(point => [
									point.longitude,
									point.latitude,
								]),
							},
						},
					],
				};

				map.addSource('line', {
					type: 'geojson',
					data: geojson,
				});

				map.addLayer({
					id: 'line-background',
					type: 'line',
					source: 'line',
					paint: {
						'line-color': 'orange',
						'line-width': 6,
						'line-opacity': 0.4,
					},
				});

				map.addLayer({
					id: 'line-dashed',
					type: 'line',
					source: 'line',
					paint: {
						'line-color': 'orange',
						'line-width': 6,
						'line-dasharray': [0, 4, 3],
					},
				});

				// 애니메이션
				const dashArraySequence = [
					[0, 4, 3],
					[0.5, 4, 2.5],
					[1, 4, 2],
					[1.5, 4, 1.5],
					[2, 4, 1],
					[2.5, 4, 0.5],
					[3, 4, 0],
					[0, 0.5, 3, 3.5],
					[0, 1, 3, 3],
					[0, 1.5, 3, 2.5],
					[0, 2, 3, 2],
					[0, 2.5, 3, 1.5],
					[0, 3, 3, 1],
					[0, 3.5, 3, 0.5],
				];

				let step = 0;

				function animateDashArray(timestamp: number): void {
					const newStep: number = Math.floor(
						(timestamp / 50) % dashArraySequence.length,
					);

					if (newStep !== step) {
						map?.setPaintProperty(
							'line-dashed',
							'line-dasharray',
							dashArraySequence[newStep] as number[],
						);
						step = newStep;
					}

					requestAnimationFrame(animateDashArray);
				}

				animateDashArray(0);

				SkyLayer(map);
				ThreeDBuildingsLayer(map);
				MapStyles(map);
			});
		}, 2500);
	}, [map, userLocation, setIsGlobeView, route]);

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
