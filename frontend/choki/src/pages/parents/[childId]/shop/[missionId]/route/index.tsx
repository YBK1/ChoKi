import BottomNavbar from '@/components/Common/Navbar/BottomNavbar';
import Map from '@/components/map/Map';
import { parentWebSocketClient } from '@/lib/ws/WebSocketClient';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function ChildIsShoppingPage() {
	const [route, setRoute] = useState<
		{ latitude: number; longitude: number }[] | undefined
	>(undefined);
	const [currentLocation, setCurrentLocation] = useState<{
		latitude: number;
		longitude: number;
	} | null>(null);

	const router = useRouter();
	const { missionId } = router.query;

	useEffect(() => {
		parentWebSocketClient.connect();

		parentWebSocketClient.subscribe(`/user/sub/shopping/${missionId}`, msg => {
			console.log('Received message:', msg.body);
			const data = JSON.parse(msg.body);

			if (data.route) {
				setRoute(data.route);
			} else if (data.type === 'POINT' && data.latitude && data.longitude) {
				setCurrentLocation({
					latitude: data.latitude,
					longitude: data.longitude,
				});
			}
		});

		return () => {
			parentWebSocketClient.disconnect();
		};
	}, [missionId]);

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
						showPreviousButton={false}
						showRouteRecorder={false}
						showChildNavBar={false}
						route={route}
						coordinates={currentLocation}
					/>
				</div>
			</div>

			<BottomNavbar />
		</div>
	);
}
