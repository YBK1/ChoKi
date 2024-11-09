import BottomNavbar from '@/components/Common/Navbar/BottomNavbar';
import Map from '@/components/map/Map';

export default function ChildIsShoppingPage() {
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
					/>
				</div>
			</div>

			{/* Bottom Navigation */}
			<BottomNavbar />
		</div>
	);
}
