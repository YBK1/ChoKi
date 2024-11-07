import { useState } from 'react';
import MapContainer from './MapContainer';
import UserLocationMarker from './UserLocationMarker';
import RoutePolyline from './RoutePolyline';
import RouteRecorder from './RouteRecorder';
import SetDestination from './SetDestination';
import { useRouter } from 'next/router';
import Image from 'next/image';

const Map = ({
	showRouteRecorder = true,
	showPolyline = true,
	showPreviousButton = true,
}: MapProps) => {
	const [mapInstance, setMapInstance] = useState<any>(null);
	const [polyline, setPolyline] = useState<any>(null);
	const [finalRoute, setFinalRoute] = useState<
		{ latitude: number; longitude: number }[]
	>([]);
	const [showSetDestination, setShowSetDestination] = useState(false);
	const router = useRouter();

	const handleRecordingFinished = () => {
		setShowSetDestination(true);
	};

	const goToPreviousPage = () => {
		router.push('/parents');
	};

	const onClose = () => {
		setShowSetDestination(false);
	};

	return (
		<div style={{ height: '100vh', width: '100%', position: 'relative' }}>
			{mapInstance && showSetDestination && (
				<SetDestination onClose={onClose} route={finalRoute} />
			)}
			{showPreviousButton && (
				<button
					onClick={goToPreviousPage}
					style={{
						position: 'absolute',
						top: '15px',
						left: '15px',
						backgroundColor: '#e0e0e0',
						border: 'none',
						fontSize: '20px',
						cursor: 'pointer',
						borderRadius: '5px',
						padding: '10px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						zIndex: 5,
					}}
				>
					<Image src="/icons/back.png" alt="Back" width={7} height={7} />
				</button>
			)}
			<MapContainer onMapLoad={setMapInstance} />
			{mapInstance && <UserLocationMarker map={mapInstance} />}
			{mapInstance && showPolyline && (
				<RoutePolyline
					map={mapInstance}
					finalRoute={finalRoute}
					polyline={polyline}
					setPolyline={setPolyline}
				/>
			)}
			{showRouteRecorder && (
				<div
					style={{
						position: 'absolute',
						bottom: '10px',
						left: '50%',
						transform: 'translateX(-50%)',
						zIndex: 10,
						padding: '10px',
						borderRadius: '5px',
					}}
				>
					<RouteRecorder
						map={mapInstance}
						setFinalRoute={setFinalRoute}
						onRecordingFinish={handleRecordingFinished}
					/>
				</div>
			)}
		</div>
	);
};

export default Map;
