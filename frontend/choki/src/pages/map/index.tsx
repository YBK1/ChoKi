// pages/map.tsx
import { useState } from 'react';
import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('@/components/map/Map'), {
	ssr: false,
});
const DynamicUserLocation = dynamic(
	() => import('@/components/map/UserLocation'),
	{ ssr: false },
);

const MapPage = () => {
	const [map, setMap] = useState<any>(null);

	return (
		<div style={{ height: '100vh', width: '100%' }}>
			<DynamicMap onMapLoad={setMap} />
			{map && <DynamicUserLocation map={map} />}
		</div>
	);
};

export default MapPage;
