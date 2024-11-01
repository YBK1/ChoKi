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
	const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

	const startRecording = () => {
		if (!isRecording && map) {
			setIsRecording(true);
			recordingIntervalRef.current = setInterval(() => {
				navigator.geolocation.getCurrentPosition(
					position => {
						const { latitude, longitude } = position.coords;
						setRoute(prevRoute => {
							const newRoute = [...prevRoute, { latitude, longitude }];
							console.log('Recording Location:', { latitude, longitude });
							return newRoute;
						});
					},
					error => {
						console.error('위치 가져오는 중 오류 발생:', error);
					},
					{
						enableHighAccuracy: true,
						timeout: 10000,
						maximumAge: 0,
					},
				);
			}, 3000);
		}
	};

	const stopRecording = () => {
		if (isRecording && recordingIntervalRef.current) {
			setIsRecording(false);
			clearInterval(recordingIntervalRef.current);
			recordingIntervalRef.current = null;
			console.log('기록된 경로:', route);
		}
	};

	useEffect(() => {
		return () => {
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

const buttonStyle = {
	backgroundColor: '#fff',
	border: 'none',
	padding: '10px',
	cursor: 'pointer',
	borderRadius: '8px',
	margin: '5px',
};

export default RouteRecorder;
