import { useState } from 'react';
import { useRouter } from 'next/router';
import MapIcon from '../../assets/icons/map_icon_blurry.svg';
import Image from 'next/image';

const DestinationSearch = ({ map }: DestinationSearchProps) => {
	const [destination, setDestination] = useState<string>('');
	const [searchResults, setSearchResults] = useState<any[]>([]);
	const router = useRouter();

	const calculateDistance = (
		lat1: number,
		lon1: number,
		lat2: number,
		lon2: number,
	) => {
		const R = 6371;
		const dLat = ((lat2 - lat1) * Math.PI) / 180;
		const dLon = ((lon2 - lon1) * Math.PI) / 180;
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos((lat1 * Math.PI) / 180) *
				Math.cos((lat2 * Math.PI) / 180) *
				Math.sin(dLon / 2) *
				Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c;
	};

	const handleSearch = () => {
		if (!map || !destination) return;

		const kakao = (window as any).kakao;
		const places = new kakao.maps.services.Places();
		const mapCenter = map.getCenter();

		places.keywordSearch(destination, (result: any, status: any) => {
			if (status === kakao.maps.services.Status.OK) {
				result.forEach((place: any) => {
					const distance = calculateDistance(
						mapCenter.getLat(),
						mapCenter.getLng(),
						parseFloat(place.y),
						parseFloat(place.x),
					);
					place.distance = distance;
				});

				result.sort((a: any, b: any) => a.distance - b.distance);

				setSearchResults(result);
			} else {
				console.error('위치 검색 실패:', status);
			}
		});
	};

	const handleSelect = (place: any) => {
		const location = new kakao.maps.LatLng(place.y, place.x);
		map.setCenter(location);

		const marker = new kakao.maps.Marker({
			position: location,
		});
		marker.setMap(map);

		setSearchResults([]);
	};

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
					onClick={handleSearch}
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

			{searchResults.length > 0 && (
				<ul
					style={{
						marginTop: '10px',
						listStyleType: 'none',
						padding: 0,
						maxHeight: '150px',
						overflowY: 'auto',
						border: '1px solid #ccc',
						borderRadius: '10px',
					}}
				>
					{searchResults.map((place, index) => (
						<li
							key={index}
							onClick={() => handleSelect(place)}
							style={{
								padding: '10px',
								cursor: 'pointer',
								borderBottom: '1px solid #eee',
							}}
						>
							{place.place_name} - {place.distance.toFixed(2)} km
						</li>
					))}
				</ul>
			)}

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
