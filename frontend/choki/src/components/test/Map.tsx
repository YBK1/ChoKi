import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import GlobeView from './GlobeView';
import TransitionToLocalView from './TransitionToLocalView';
import CurrentLocationButton from './CurrentLocationButton';
import RouteRecorder from './RouteRecorder';

mapboxgl.accessToken =
	'pk.eyJ1IjoicGlpbGxsIiwiYSI6ImNtMnk1YTFsejBkcW0ycHM4a2lsNnNjbmcifQ.Iw08nUzhhZyUbZQNPoOu1A';
const MapComponent = () => {
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const [map, setMap] = useState<mapboxgl.Map | null>(null);
	const [userLocation, setUserLocation] = useState<[number, number] | null>(
		null,
	);
	const [isGlobeView, setIsGlobeView] = useState(true);

	useEffect(() => {
		if (!mapContainerRef.current) return;

		const mapInstance = new mapboxgl.Map({
			container: mapContainerRef.current,
			style: 'mapbox://styles/mapbox/satellite-v9',
			center: [0, 20],
			zoom: 1.5,
			projection: 'globe',
			attributionControl: false,
		});

		mapInstance.on('load', () => {
			setMap(mapInstance); // Set the map state once it's fully loaded
		});

		return () => {
			mapInstance.remove();
		};
	}, []); // Removed mapContainerRef from the dependency array

	useEffect(() => {
		if (!map) return; // Wait until the map is initialized

		navigator.geolocation.getCurrentPosition(
			position => {
				const { latitude, longitude } = position.coords;
				setUserLocation([longitude, latitude]);
			},
			error => {
				console.error('Error getting location:', error);
			},
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 0,
			},
		);
	}, [map]); // Only run this effect when the map is available

	return (
		<div className="relative w-full h-screen">
			<div ref={mapContainerRef} className="w-full h-full" />
			{isGlobeView ? (
				<>
					<GlobeView
						mapContainerRef={mapContainerRef}
						setMap={setMap}
						setIsGlobeView={setIsGlobeView}
					/>
					<TransitionToLocalView
						map={map}
						userLocation={userLocation}
						setIsGlobeView={setIsGlobeView}
					/>
				</>
			) : (
				<>
					<CurrentLocationButton map={map} />
					<RouteRecorder map={map} />
				</>
			)}
		</div>
	);
};

export default MapComponent;
