import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import CustomMarker from './CustomMarker';
import SkyLayer from './SkyLayer';
import ThreeDBuildingsLayer from './3DBuildingsLayer';
import MapStyles from './MapStyles';
import CurrentLocationButton from './CurrentLocationButton';
import RouteRecorder from './RouteRecorder';

mapboxgl.accessToken =
	'pk.eyJ1IjoicGlpbGxsIiwiYSI6ImNtMnk1YTFsejBkcW0ycHM4a2lsNnNjbmcifQ.Iw08nUzhhZyUbZQNPoOu1A';

const MapComponent = () => {
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const [map, setMap] = useState<mapboxgl.Map | null>(null);

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(
			position => {
				const { latitude, longitude } = position.coords;

				const mapInstance = new mapboxgl.Map({
					container: mapContainerRef.current!,
					style: 'mapbox://styles/mapbox/streets-v11',
					center: [longitude, latitude],
					zoom: 18,
					pitch: 75,
					attributionControl: false,
				});

				setMap(mapInstance);

				mapInstance.on('style.load', () => {
					const style = mapInstance.getStyle();
					if (style && style.layers) {
						style.layers.forEach(layer => {
							if (
								layer.type === 'symbol' &&
								layer.layout &&
								'text-field' in layer.layout
							) {
								mapInstance.setLayoutProperty(layer.id, 'text-field', [
									'coalesce',
									['get', 'name_ko'],
									['get', 'name'],
								]);
							}
						});
					}

					CustomMarker(mapInstance, latitude, longitude);
					SkyLayer(mapInstance);
					ThreeDBuildingsLayer(mapInstance);
					MapStyles(mapInstance);
				});

				return () => mapInstance.remove();
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
		<>
			<style>{`.mapboxgl-ctrl-logo { display: none !important; }`}</style>
			<div style={{ position: 'relative', width: '100%', height: '100vh' }}>
				<div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
				<CurrentLocationButton map={map} />
				<RouteRecorder map={map} />
			</div>
		</>
	);
};

export default MapComponent;
