import { useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import CustomMarker from './CustomMarker';
import SkyLayer from './SkyLayer';
import ThreeDBuildingsLayer from './3DBuildingsLayer';
import MapStyles from './MapStyles';

interface TransitionToLocalViewProps {
	map: mapboxgl.Map | null;
	userLocation: [number, number] | null;
	setIsGlobeView: (value: boolean) => void;
}

// eslint-disable-next-line no-undef
const TransitionToLocalView: React.FC<TransitionToLocalViewProps> = ({
	map,
	userLocation,
	setIsGlobeView,
}) => {
	const transitionToLocalView = useCallback(() => {
		if (!map || !userLocation) return;

		setIsGlobeView(false);

		// Initial zoom out to prepare for transition
		map.flyTo({
			center: userLocation,
			zoom: 3,
			duration: 2000,
			pitch: 0,
			bearing: 0,
		});

		// Transition to street view
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

				// Final zoom to street level
				map.flyTo({
					center: userLocation,
					zoom: 18,
					pitch: 75,
					duration: 3000,
					essential: true,
				});

				// Add custom layers
				CustomMarker(map, userLocation[1], userLocation[0]);
				SkyLayer(map);
				ThreeDBuildingsLayer(map);
				MapStyles(map);
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
			{userLocation ? '현재 위치로 이동' : '위치 확인 중...'}
		</button>
	);
};

export default TransitionToLocalView;
