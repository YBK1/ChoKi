import BottomNavbar from '@/components/Common/Navbar/BottomNavbar';
import Map from '@/components/map/Map';

export default function ChildIsShoppingPage() {
	const route = [
		{ latitude: 35.1651676, longitude: 126.8788277 },
		{ latitude: 35.1655676, longitude: 126.8789277 },
		{ latitude: 35.1657676, longitude: 126.8786277 },
		{ latitude: 35.1652676, longitude: 126.8790277 },
		{ latitude: 35.1649676, longitude: 126.8785277 },
		{ latitude: 35.1653676, longitude: 126.8787277 },
		{ latitude: 35.1648676, longitude: 126.8784277 },
		{ latitude: 35.1654676, longitude: 126.8783277 },
		{ latitude: 35.1647676, longitude: 126.8791277 },
		{ latitude: 35.1658676, longitude: 126.8782277 },
	];
	return (
		<div className="relative min-h-screen bg-light_yellow flex flex-col items-center justify-center">
			<div
				className="w-full max-w-3xl overflow-hidden shadow-lg rounded-lg p-2"
				style={{
					height: '450px',
					position: 'relative',
				}}
			>
				<div
					style={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: '100%',
						height: '850px',
					}}
				>
					<Map
						showPolyline={true}
						showPreviousButton={true}
						showRouteRecorder={false}
						showChildNavBar={false}
						route={route}
					/>
				</div>
			</div>

			<BottomNavbar />
		</div>
	);
}
