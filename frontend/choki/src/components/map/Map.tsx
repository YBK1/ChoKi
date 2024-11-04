import { useState } from 'react';
import MapContainer from './MapContainer';
import UserLocationMarker from './UserLocationMarker';
import RoutePolyline from './RoutePolyline';
import RouteRecorder from './RouteRecorder';
import DestinationSearch from './DestinationSearch';

type MapProps = {
	showRouteRecorder?: boolean;
	showPolyline?: boolean;
	showDestinationSearch?: boolean;
};

const Map = ({
	showRouteRecorder = true,
	showPolyline = true,
	showDestinationSearch = true,
}: MapProps) => {
	const [mapInstance, setMapInstance] = useState<any>(null);
	const [polyline, setPolyline] = useState<any>(null);
	const [finalRoute, setFinalRoute] = useState<{ lat: number; lng: number }[]>(
		[],
	);

	return (
		<div style={{ height: '100vh', width: '100%', position: 'relative' }}>
			{mapInstance && showDestinationSearch && (
				<DestinationSearch map={mapInstance} />
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
					<RouteRecorder setFinalRoute={setFinalRoute} />
				</div>
			)}
		</div>
	);
};

export default Map;
