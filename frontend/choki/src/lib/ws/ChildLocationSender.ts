import { useEffect } from 'react';
import { childWebSocketClient } from '@/lib/ws/WebSocketClient';

const ChildLocationSender = (shoppingId: string) => {
	useEffect(() => {
		const sendLocation = () => {
			navigator.geolocation.getCurrentPosition(
				position => {
					const { latitude, longitude } = position.coords;
					const message = {
						shoppingId,
						latitude,
						longitude,
					};
					childWebSocketClient.sendMessage('/pub/shopping/point', message);
					console.log('Location sent:', message);
				},
				error => console.error('Error getting location:', error),
				{ enableHighAccuracy: true },
			);
		};

		const intervalId = setInterval(sendLocation, 5000); // Send every 5 seconds

		return () => clearInterval(intervalId); // Clean up interval on component unmount
	}, [shoppingId]); // Add shoppingId as dependency

	return null;
};

export default ChildLocationSender;
