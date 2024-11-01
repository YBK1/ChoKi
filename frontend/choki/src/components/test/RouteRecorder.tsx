/* eslint-disable no-undef */
import { useState, useEffect, useRef } from 'react';

interface RouteRecorderProps {
	map: mapboxgl.Map | null;
}

const RouteRecorder: React.FC<RouteRecorderProps> = ({ map }) => {
	const [route, setRoute] = useState<
		Array<{ latitude: number; longitude: number }>
	>([]);
	const [isRecording, setIsRecording] = useState(false);
	const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null); // Use useRef for recordingInterval

	// Function to start recording the route
	const startRecording = () => {
		if (!isRecording && map) {
			setIsRecording(true);
			recordingIntervalRef.current = setInterval(() => {
				navigator.geolocation.getCurrentPosition(
					position => {
						const { latitude, longitude } = position.coords;
						setRoute(prevRoute => {
							const newRoute = [...prevRoute, { latitude, longitude }];
							console.log('Recording Location:', { latitude, longitude }); // Log each new location
							return newRoute;
						});
					},
					error => {
						console.error('Error getting location:', error);
					},
					{
						enableHighAccuracy: true,
						timeout: 10000,
						maximumAge: 0,
					},
				);
			}, 3000); // Record location every 3 seconds
		}
	};

	// Function to stop recording the route
	const stopRecording = () => {
		if (isRecording && recordingIntervalRef.current) {
			setIsRecording(false);
			clearInterval(recordingIntervalRef.current);
			recordingIntervalRef.current = null;
			console.log('Route recorded:', route); // Log the full route array
		}
	};

	useEffect(() => {
		return () => {
			// Cleanup interval on component unmount
			if (recordingIntervalRef.current) {
				clearInterval(recordingIntervalRef.current);
			}
		};
	}, []);

	return (
		<div
			style={{
				position: 'absolute',
				bottom: '50px',
				left: '50%',
				transform: 'translateX(-50%)',
			}}
		>
			<button onClick={startRecording} style={buttonStyle}>
				Start Recording
			</button>
			<button onClick={stopRecording} style={buttonStyle}>
				Stop Recording
			</button>
		</div>
	);
};

// Button styling
const buttonStyle = {
	backgroundColor: '#fff',
	border: 'none',
	padding: '10px',
	cursor: 'pointer',
	borderRadius: '8px',
	margin: '5px',
};

export default RouteRecorder;
