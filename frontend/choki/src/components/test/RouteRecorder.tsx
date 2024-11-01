/* eslint-disable no-undef */
import mapboxgl from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';

interface RouteRecorderProps {
	map: mapboxgl.Map | null;
}

const RouteRecorder: React.FC<RouteRecorderProps> = ({ map }) => {
	const [route, setRoute] = useState<
		Array<{ latitude: number; longitude: number }>
	>([]);
	const [isRecording, setIsRecording] = useState(false);
	const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

	const routeGeoJSON: GeoJSON.FeatureCollection<GeoJSON.LineString> = {
		type: 'FeatureCollection',
		features: [
			{
				type: 'Feature',
				geometry: {
					type: 'LineString',
					coordinates: [] as Array<[number, number]>,
				},
				properties: {},
			},
		],
	};

	const startRecording = () => {
		if (!isRecording && map) {
			setIsRecording(true);
			recordingIntervalRef.current = setInterval(() => {
				navigator.geolocation.getCurrentPosition(
					position => {
						const { latitude, longitude } = position.coords;
						setRoute(prevRoute => {
							const newRoute = [...prevRoute, { latitude, longitude }];
							console.log('기록된 위치:', { latitude, longitude });

							routeGeoJSON.features[0].geometry.coordinates.push([
								longitude,
								latitude,
							]);

							if (map.getSource('route')) {
								(map.getSource('route') as mapboxgl.GeoJSONSource).setData(
									routeGeoJSON,
								);
							} else {
								map.addSource('route', {
									type: 'geojson',
									data: routeGeoJSON,
								});
								map.addLayer({
									id: 'route',
									type: 'line',
									source: 'route',
									paint: {
										'line-color': '#FF0000', // 빨강
										'line-width': 4,
									},
								});
							}

							return newRoute;
						});
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
			}, 3000);
		}
	};

	const stopRecording = () => {
		if (isRecording && recordingIntervalRef.current) {
			setIsRecording(false);
			clearInterval(recordingIntervalRef.current);
			recordingIntervalRef.current = null;
			console.log('기록된 경로:', route);
		}
	};

	useEffect(() => {
		return () => {
			if (recordingIntervalRef.current) {
				clearInterval(recordingIntervalRef.current);
			}
		};
	}, []);

	return (
		<div
			style={{
				position: 'absolute',
				bottom: '50px',
				left: '50%',
				transform: 'translateX(-50%)',
			}}
		>
			<button onClick={startRecording} style={buttonStyle}>
				기록 시작
			</button>
			<button onClick={stopRecording} style={buttonStyle}>
				기록 끝
			</button>
		</div>
	);
};

const buttonStyle = {
	backgroundColor: '#fff',
	border: 'none',
	padding: '10px',
	cursor: 'pointer',
	borderRadius: '8px',
	margin: '5px',
};

export default RouteRecorder;
