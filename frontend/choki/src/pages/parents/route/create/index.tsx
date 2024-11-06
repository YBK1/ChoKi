import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('@/components/map/Map'), {
	ssr: false,
});

const MapPage = () => {
	return (
		<div style={{ height: '100vh', width: '100%' }}>
			<DynamicMap
				showRouteRecorder={true}
				showPolyline={true}
				showDestinationSearch={true}
			/>
		</div>
	);
};

export default MapPage;
