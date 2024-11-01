import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import CustomMarker from './CustomMarker';
import SkyLayer from './SkyLayer';
import ThreeDBuildingsLayer from './3DBuildingsLayer';
import MapStyles from './MapStyles';

mapboxgl.accessToken =
	'pk.eyJ1IjoicGlpbGxsIiwiYSI6ImNtMnk1YTFsejBkcW0ycHM4a2lsNnNjbmcifQ.Iw08nUzhhZyUbZQNPoOu1A';

const MapComponent = () => {
	const mapContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(
			position => {
				const { latitude, longitude } = position.coords;

				const map = new mapboxgl.Map({
					container: mapContainerRef.current!,
					style: 'mapbox://styles/mapbox/streets-v11',
					center: [longitude, latitude],
					zoom: 18,
					pitch: 75,
				});

				map.on('style.load', () => {
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

					CustomMarker(map, latitude, longitude);
					SkyLayer(map);
					ThreeDBuildingsLayer(map);
					MapStyles(map);
				});

				return () => map.remove();
			},
			error => {
				console.error('위치 불러오는 중 오류 발생:', error);
			},
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 0,
			},
		);
	}, []);

	return (
		<div ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />
	);
};

export default MapComponent;
