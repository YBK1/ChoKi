import { useAtom } from 'jotai';
import { mapViewAtom } from '@/atoms/mapViewAtom';
import { useRouter } from 'next/router';
import StreetNavigationMap from './StreetNavigationMap';
import SatelliteGlobeMap from './SatelliteGlobeMap';
import mapboxgl from 'mapbox-gl';
import { useState, useEffect } from 'react';

mapboxgl.accessToken =
	'pk.eyJ1IjoicGlpbGxsIiwiYSI6ImNtMnk1YTFsejBkcW0ycHM4a2lsNnNjbmcifQ.Iw08nUzhhZyUbZQNPoOu1A';

const MapContainer = () => {
	const router = useRouter();
	const { missionId } = router.query;
	const [mapViewState, setMapViewState] = useAtom(mapViewAtom);
	const [fade, setFade] = useState(false);

	const handleTransitionComplete = () => {
		setMapViewState(prev => ({ ...prev, hasInitialized: true }));
	};

	useEffect(() => {
		const timer = setTimeout(() => setFade(false), 500);
		return () => clearTimeout(timer);
	}, [mapViewState.hasInitialized]);

	return (
		<div className="relative w-full h-full">
			{/* SatelliteGlobeMap */}
			<div
				className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
					!mapViewState.hasInitialized && !fade
						? 'opacity-100 z-20'
						: 'opacity-0 z-10 pointer-events-none'
				}`}
			>
				<SatelliteGlobeMap onTransitionComplete={handleTransitionComplete} />
			</div>

			{/* StreetNavigationMap */}
			<div
				className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
					mapViewState.hasInitialized && !fade
						? 'opacity-100 z-20'
						: 'opacity-0 z-10 pointer-events-none'
				}`}
			>
				<StreetNavigationMap missionId={missionId as string} />
			</div>
		</div>
	);
};

export default MapContainer;
