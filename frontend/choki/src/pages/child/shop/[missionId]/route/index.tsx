import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

interface MapProps {
	missionId: string;
}

const DynamicMap = dynamic<MapProps>(
	() => import('@/components/navigation/Map'),
	{
		ssr: false,
	},
);

const MapPage = () => {
	const router = useRouter();
	const { missionId } = router.query;

	return (
		<div style={{ height: '100vh', width: '100%' }}>
			{missionId && <DynamicMap missionId={missionId as string} />}{' '}
		</div>
	);
};

export default MapPage;
