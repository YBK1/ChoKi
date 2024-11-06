import Image from 'next/image';
import React from 'react';

const TimeDistanceTracker = () => {
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
					10분
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
					650보
				</div>
				<div style={{ fontSize: '14px', color: 'white' }}>남은 걸음 수</div>
			</div>
		</div>
	);
};

export default TimeDistanceTracker;
