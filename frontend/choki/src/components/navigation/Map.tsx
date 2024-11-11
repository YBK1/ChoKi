import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import TransitionToLocalView from './TransitionToLocalView';
import CurrentLocationButton from './CurrentLocationButton';
import TimeDistanceTracker from './TimeDistanceTracker';
import UpperNavbar from '../Common/Navbar/UpperNavbar';
import ChildLocationSender from '@/lib/ws/ChildLocationSender';
import { childWebSocketClient } from '@/lib/ws/WebSocketClient';

mapboxgl.accessToken =
	'pk.eyJ1IjoicGlpbGxsIiwiYSI6ImNtMnk1YTFsejBkcW0ycHM4a2lsNnNjbmcifQ.Iw08nUzhhZyUbZQNPoOu1A';

const MapComponent = () => {
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const [map, setMap] = useState<mapboxgl.Map | null>(null);
	const [userLocation, setUserLocation] = useState<[number, number] | null>(
		null,
	);
	const [isGlobeView, setIsGlobeView] = useState(true);
	const [showLocalViewElements, setShowLocalViewElements] = useState(false);
	const [route, setRoute] = useState<
		{ latitude: number; longitude: number }[] | null
	>(null);
	const router = useRouter();

	const goBack = () => {
		router.push('/child/main');
	};

	useEffect(() => {
		if (!mapContainerRef.current) return;

		mapContainerRef.current.innerHTML = '';

		const mapInstance = new mapboxgl.Map({
			container: mapContainerRef.current,
			style: 'mapbox://styles/mapbox/satellite-v9',
			center: [0, 20],
			zoom: 1.5,
			projection: 'globe',
			attributionControl: false,
		});

		mapInstance.on('style.load', () => {
			mapInstance.setFog({
				color: 'rgb(186, 210, 235)',
				'high-color': 'rgb(36, 92, 223)',
				'horizon-blend': 0.02,
				'space-color': 'rgb(11, 11, 25)',
				'star-intensity': 0.6,
			});

			setMap(mapInstance);
		});

		return () => {
			mapInstance.remove();
		};
	}, []);

	useEffect(() => {
		if (!map) return;

		navigator.geolocation.getCurrentPosition(
			position => {
				const { latitude, longitude } = position.coords;
				setUserLocation([longitude, latitude]);
			},
			error => {
				console.error('현재 위치 가져오는 중 오류 발생:', error);
			},
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 0,
			},
		);
	}, [map]);

	useEffect(() => {
		if (!isGlobeView) {
			const timer = setTimeout(() => setShowLocalViewElements(true), 5500);
			return () => clearTimeout(timer);
		} else {
			setShowLocalViewElements(false);
		}
	}, [isGlobeView]);

	useEffect(() => {
		childWebSocketClient.connect();

		childWebSocketClient.subscribe(
			`/user/sub/shopping/672f0b493251e83e3031604c`,
			msg => {
				console.log('받은 문자:', msg.body);

				const missonRoute = JSON.parse(msg.body).route;
				setRoute(missonRoute);
			},
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (route) {
			console.log('Updated route:', route);
		}
	}, [route]);

	return (
		<div className="relative w-full h-screen">
			<style>{`.mapboxgl-ctrl-logo { display: none !important; }`}</style>{' '}
			<div ref={mapContainerRef} className="w-full h-full" />
			<ChildLocationSender shoppingId="672f0b493251e83e3031604c" />
			{isGlobeView ? (
				<>
					<TransitionToLocalView
						map={map}
						userLocation={userLocation}
						setIsGlobeView={setIsGlobeView}
						route={route}
					/>
					<button
						onClick={goBack}
						className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-lg"
					>
						돌아가기
					</button>
				</>
			) : (
				showLocalViewElements && (
					<>
						<CurrentLocationButton map={map} />
						<TimeDistanceTracker
							route={route ?? []}
							userLocation={userLocation}
						/>
						<UpperNavbar />
					</>
				)
			)}
		</div>
	);
};

export default MapComponent;
