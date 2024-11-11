import Image from 'next/image';
import React, { useEffect, useState } from 'react';

type RoutePoint = {
	latitude: number;
	longitude: number;
};

type TimeDistanceTrackerProps = {
	route: RoutePoint[];
	userLocation: [number, number] | null;
};

const AVERAGE_WALKING_SPEED = 1.4;
const AVERAGE_STEP_LENGTH = 0.7;

const TimeDistanceTracker: React.FC<TimeDistanceTrackerProps> = ({ route }) => {
	const [remainingTime, setRemainingTime] = useState(0);
	const [remainingSteps, setRemainingSteps] = useState(0);

	const calculateDistance = (
		lat1: number,
		lon1: number,
		lat2: number,
		lon2: number,
	): number => {
		const R = 6371000;
		const dLat = (lat2 - lat1) * (Math.PI / 180);
		const dLon = (lon2 - lon1) * (Math.PI / 180);
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(lat1 * (Math.PI / 180)) *
				Math.cos(lat2 * (Math.PI / 180)) *
				Math.sin(dLon / 2) *
				Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c;
	};

	useEffect(() => {
		let totalDistance = 0;
		for (let i = 0; i < route.length - 1; i++) {
			totalDistance += calculateDistance(
				route[i].latitude,
				route[i].longitude,
				route[i + 1].latitude,
				route[i + 1].longitude,
			);
		}

		const timeInSeconds = totalDistance / AVERAGE_WALKING_SPEED;
		const steps = totalDistance / AVERAGE_STEP_LENGTH;

		setRemainingTime(Math.ceil(timeInSeconds / 60));
		setRemainingSteps(Math.ceil(steps));
	}, [route]);

	return (
		<div
			style={{
				position: 'absolute',
				bottom: '0',
				width: '100%',
				backgroundColor: '#ADD8E6',
				borderTopLeftRadius: '20px',
				borderTopRightRadius: '20px',
				padding: '20px',
				display: 'flex',
				justifyContent: 'space-around',
				alignItems: 'center',
				boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
			}}
		>
			<div style={{ textAlign: 'center' }}>
				<Image
					src="/icons/clock_icon.png"
					alt="Time Icon"
					width={30}
					height={30}
					style={{ marginBottom: '5px', marginLeft: '10px' }}
				/>
				<div style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>
					{remainingTime}분
				</div>
				<div style={{ fontSize: '14px', color: 'white' }}>남은 시간</div>
			</div>

			<div style={{ textAlign: 'center' }}>
				<Image
					src="/icons/step_icon.png"
					alt="Steps Icon"
					width={30}
					height={30}
					style={{ marginBottom: '5px', marginLeft: '15px' }}
				/>
				<div style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>
					{remainingSteps}보
				</div>
				<div style={{ fontSize: '14px', color: 'white' }}>남은 걸음 수</div>
			</div>
		</div>
	);
};

export default TimeDistanceTracker;
