import { useState } from 'react';
import MapComponent from './MapComponent';
import UserLocation from './UserLocation';
import Navigation from './Navigation';

const Map = () => {
	const [map, setMap] = useState<any>(null);

	return (
		<div>
			<MapComponent onMapLoad={setMap} />
			{map && <UserLocation map={map} />}
			<Navigation />
		</div>
	);
};

export default Map;
