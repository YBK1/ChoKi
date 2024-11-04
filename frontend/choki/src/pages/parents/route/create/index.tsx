import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('@/components/map/Map'), {
	ssr: false,
});

const MapPage = () => {
	return (
		<div style={{ height: '100vh', width: '100%' }}>
			<DynamicMap />
		</div>
	);
};

export default MapPage;
