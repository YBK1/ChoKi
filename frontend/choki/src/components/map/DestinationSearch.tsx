import { useState } from 'react';
import { useRouter } from 'next/router';
import MapIcon from '../../assets/icons/map_icon_blurry.svg';
import Image from 'next/image';

const DestinationSearch = () => {
	const [destination, setDestination] = useState<string>('');
	const router = useRouter();

	const goToPreviousPage = () => {
		router.push('/parents');
	};

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
				onClick={goToPreviousPage}
				style={{
					position: 'absolute',
					top: '15px',
					left: '15px',
					backgroundColor: '#e0e0e0',
					border: 'none',
					fontSize: '20px',
					cursor: 'pointer',
					borderRadius: '5px',
					padding: '10px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Image src="/icons/back.png" alt="Back" width={7} height={7} />
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
						src="/icons/search_icon.png"
						alt="Search Icon"
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
