import BottomNavbar from '@/components/Common/Navbar/BottomNavbar';
import Map from '@/components/map/Map';
import { parentWebSocketClient } from '@/lib/ws/WebSocketClient';
import { useEffect, useState } from 'react';

export default function ChildIsShoppingPage() {
	const [route, setRoute] = useState<
		{ latitude: number; longitude: number }[] | undefined
	>(undefined);

	useEffect(() => {
		parentWebSocketClient.connect();

		parentWebSocketClient.subscribe(
			`/user/sub/shopping/672f0b493251e83e3031604c`,
			msg => {
				console.log('Received message:', msg.body);

				const missionRoute = JSON.parse(msg.body).route;
				setRoute(missionRoute);
			},
		);
	}, []);

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
