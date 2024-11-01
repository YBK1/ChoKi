import { FC } from 'react';
import mapboxgl from 'mapbox-gl';

interface CenterButtonProps {
	map: mapboxgl.Map | null;
}

const CurrentLocationButton: FC<CenterButtonProps> = ({ map }) => {
	const centerMapOnLocation = () => {
		if (navigator.geolocation && map) {
			navigator.geolocation.getCurrentPosition(
				position => {
					const { latitude, longitude } = position.coords;
					map.flyTo({ center: [longitude, latitude], zoom: 18 });
				},
				error => {
					console.error('현재 위치 가져오는 중 오류 발생:', error);
				},
				{
					enableHighAccuracy: true,
					timeout: 10000,
					maximumAge: 0,
				},
			);
		}
	};

	return (
		<button
			onClick={centerMapOnLocation}
			style={{
				position: 'absolute',
				bottom: '30%', // Position the button 20px from the bottom
				right: '1px', // Center horizontally
				transform: 'translateX(-50%)', // Adjust to center the button
				zIndex: 1,
				backgroundColor: '#fff',
				border: 'none',
				padding: '10px',
				cursor: 'pointer',
				borderRadius: '8px',
			}}
		>
			현재 위치로
		</button>
	);
};

export default CurrentLocationButton;
