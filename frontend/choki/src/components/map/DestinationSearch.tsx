import { useState } from 'react';
import Image from 'next/image';
import MapIcon from '../../assets/icons/map_icon_blurry.svg';

const DestinationSearch = ({ onClose }: { onClose: () => void }) => {
	const [destination, setDestination] = useState<string>('');

	return (
		<div
			style={{
				position: 'absolute',
				left: '50%',
				transform: 'translateX(-50%)',
				zIndex: 10,
				width: '100%',
				maxWidth: '500px',
				padding: '20px',
				backgroundColor: 'white',
				borderRadius: '20px',
				boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
				border: '1px solid #ddd',
				overflow: 'hidden',
			}}
		>
			<button
				onClick={onClose}
				style={{
					position: 'absolute',
					top: '15px',
					right: '15px',
					backgroundColor: 'transparent',
					border: 'none',
					fontSize: '20px',
					cursor: 'pointer',
				}}
			>
				&times;
			</button>

			<h2 style={{ margin: '40px 0 0', fontSize: '20px', fontWeight: 'bold' }}>
				경로 등록하기
			</h2>

			<div style={{ position: 'relative', marginTop: '40px' }}>
				<input
					type="text"
					placeholder="목적지를 입력하세요"
					value={destination}
					onChange={e => setDestination(e.target.value)}
					style={{
						width: '100%',
						padding: '10px 40px 10px 10px',
						borderRadius: '10px',
						border: '1px solid #ccc',
						fontSize: '16px',
					}}
				/>

				<div
					style={{
						position: 'absolute',
						top: '50%',
						right: '10px',
						transform: 'translateY(-50%)',
						cursor: 'pointer',
					}}
				>
					<Image
						src="/icons/plus_btn.png"
						alt="Add Icon"
						width={24}
						height={24}
					/>
				</div>
			</div>

			<div
				style={{
					position: 'absolute',
					top: '10px',
					right: '10px',
				}}
			>
				<Image
					src={MapIcon}
					alt="Icon"
					width={90}
					height={90}
					style={{ width: '120px', height: '120px', marginTop: '10px' }}
				/>
			</div>
		</div>
	);
};

export default DestinationSearch;
