import dynamic from 'next/dynamic';

// Dynamically import the Map component to ensure it runs only on the client side
const DynamicMap = dynamic(() => import('@/components/navigation/Map'), {
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
