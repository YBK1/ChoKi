import { useState } from 'react';
import MapContainer from './MapContainer';
import UserLocationMarker from './UserLocationMarker';
import RoutePolyline from './RoutePolyline';
import RouteRecorder from './RouteRecorder';
import DestinationSearch from './DestinationSearch';

const Map = ({ showRouteRecorder = true, showPolyline = true }: MapProps) => {
	const [mapInstance, setMapInstance] = useState<any>(null);
	const [polyline, setPolyline] = useState<any>(null);
	const [finalRoute, setFinalRoute] = useState<
		{ latitude: number; longitude: number }[]
	>([]);
	const [showDestinationSearch, setShowDestinationSearch] = useState(false);

	const handleRecordingFinished = () => {
		setShowDestinationSearch(true);
	};

	const onClose = () => {
		setShowDestinationSearch(false);
	};

	return (
		<div style={{ height: '100vh', width: '100%', position: 'relative' }}>
			{mapInstance && showDestinationSearch && (
				<DestinationSearch onClose={onClose} />
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
						setFinalRoute={setFinalRoute}
						onRecordingFinish={handleRecordingFinished}
					/>
				</div>
			)}
		</div>
	);
};

export default Map;
