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
import ShoppingCompleteModal from '../Common/Modal/ShoppingCompleteModal';
import Image from 'next/image';

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
	const [originalRoute, setOriginalRoute] = useState<
		{ latitude: number; longitude: number }[] | null
	>(null);
	const [currentRoute, setCurrentRoute] = useState<
		{ latitude: number; longitude: number }[] | null
	>(null);
	const [destination, setDestination] = useState<'Mart' | 'Home'>('Mart');
	const [isMissionFinishModalOpen, setIsMissionFinishModalOpen] =
		useState(false);

	const router = useRouter();

	const { missionId } = router.query;

	const goBack = () => {
		router.push('/child/main');
	};

	const openMissionFinishModal = () => {
		setIsMissionFinishModalOpen(true);
	};

	const closeMissionFinishModal = () => {
		setIsMissionFinishModalOpen(false);
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
				console.log('User location obtained:', { latitude, longitude });
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
		if (!missionId) return;

		childWebSocketClient.connect();

		childWebSocketClient.subscribe(`/user/sub/shopping/${missionId}`, msg => {
			console.log('받은 문자:', msg.body);
			const missionRoute = JSON.parse(msg.body).route;
			setOriginalRoute(missionRoute);
			setCurrentRoute(missionRoute);
		});

		return () => {
			childWebSocketClient.disconnect();
		};
	}, [missionId]);

	useEffect(() => {
		if (currentRoute) {
			console.log('Updated route:', currentRoute);
		}
	}, [currentRoute]);

	const toggleDestination = () => {
		if (destination === 'Mart') {
			setCurrentRoute(originalRoute ? [...originalRoute].reverse() : null);
			setDestination('Home');
		} else {
			setCurrentRoute(originalRoute);
			setDestination('Mart');
		}
	};

	return (
		<div className="relative w-full h-screen">
			<style>{`.mapboxgl-ctrl-logo { display: none !important; }`}</style>
			<div ref={mapContainerRef} className="w-full h-full" />
			{missionId && <ChildLocationSender shoppingId={missionId as string} />}

			{isMissionFinishModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="relative">
						<ShoppingCompleteModal missionId={missionId as string} />
						<button
							onClick={closeMissionFinishModal}
							className="absolute top-2 right-2 bg-white text-black px-2 py-1 rounded-full"
						>
							X
						</button>
					</div>
				</div>
			)}

			{isGlobeView ? (
				<>
					<TransitionToLocalView
						map={map}
						userLocation={userLocation}
						setIsGlobeView={setIsGlobeView}
						route={currentRoute}
					/>
					<button
						onClick={goBack}
						className="absolute top-4 left-4 px-4 py-2 bg-white rounded-lg shadow-lg text-lg font-semibold transition-all duration-300"
					>
						돌아가기
					</button>
				</>
			) : (
				showLocalViewElements && (
					<>
						{/* "완료" Button */}
						<button
							onClick={openMissionFinishModal}
							className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-10"
						>
							완료
						</button>
						<UpperNavbar missionId={missionId as string} />
						<CurrentLocationButton map={map} />
						<TimeDistanceTracker
							route={currentRoute ?? []}
							userLocation={userLocation}
						/>
						<div className="absolute top-28 left-1/2 transform -translate-x-1/2 z-20">
							{/* Toggle Switch */}
							<label className="relative inline-flex items-center cursor-pointer">
								<input
									type="checkbox"
									className="sr-only peer"
									checked={destination === 'Home'}
									onChange={toggleDestination}
								/>
								<div className="w-36 h-12 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-600 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-500 relative">
									<span
										className={`absolute flex items-center justify-center left-1 top-1 h-10 w-20 bg-white rounded-full text-sm font-bold transition-transform ${
											destination === 'Home' ? 'translate-x-14' : ''
										}`}
										style={{ fontSize: '1rem' }}
									>
										{destination === 'Mart' ? (
											<Image
												src="/icons/map_shop_icon.svg"
												alt="Mart Icon"
												width={30}
												height={30}
											/>
										) : (
											<Image
												src="/icons/home_nav.svg"
												alt="Home Icon"
												width={30}
												height={30}
											/>
										)}
									</span>
								</div>
							</label>
						</div>
					</>
				)
			)}
		</div>
	);
};

export default MapComponent;
