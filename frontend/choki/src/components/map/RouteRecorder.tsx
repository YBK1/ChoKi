import { useState, useEffect } from 'react';
import Image from 'next/image';
import startButton from '../../assets/icons/start_btn.svg';
import stopButton from '../../assets/icons/finish_btn.svg';

const RouteRecorder = ({ setFinalRoute }: RouteRecorderProps) => {
	const [isRecording, setIsRecording] = useState(false);
	const [watchId, setWatchId] = useState<number | null>(null);
	const [route, setRoute] = useState<{ lat: number; lng: number }[]>([]);

	const startRecording = () => {
		setIsRecording(true);
		console.log('기록 시작');
		setRoute([]);

		const id = navigator.geolocation.watchPosition(
			position => {
				const { latitude, longitude } = position.coords;
				console.log(`위도: ${latitude}, 경도: ${longitude}`);
				const newPoint = { lat: latitude, lng: longitude };

				setRoute(prevRoute => [...prevRoute, newPoint]);
			},
			error => {
				console.error('위치 가져오는 중 오류 발생:', error);
			},
			{ enableHighAccuracy: true },
		);

		setWatchId(id);
	};

	const stopRecording = () => {
		if (watchId !== null) {
			navigator.geolocation.clearWatch(watchId);
			setWatchId(null);
		}
		setIsRecording(false);

		console.log('최종 경로:', route);
		setFinalRoute(route);
	};

	useEffect(() => {
		return () => {
			if (watchId !== null) navigator.geolocation.clearWatch(watchId);
		};
	}, [watchId]);

	return (
		<div style={{ display: 'flex', gap: '40px' }}>
			<div
				onClick={startRecording}
				style={{
					cursor: isRecording ? 'not-allowed' : 'pointer',
					opacity: isRecording ? 0.5 : 1,
					background: 'transparent',
					border: 'none',
					padding: 0,
				}}
			>
				<Image src={startButton} alt="Start Recording" width={70} height={70} />
			</div>
			<div
				onClick={stopRecording}
				style={{
					cursor: !isRecording ? 'not-allowed' : 'pointer',
					opacity: !isRecording ? 0.5 : 1,
					background: 'transparent',
					border: 'none',
					padding: 0,
				}}
			>
				<Image src={stopButton} alt="Stop Recording" width={70} height={70} />
			</div>
		</div>
	);
};

export default RouteRecorder;
