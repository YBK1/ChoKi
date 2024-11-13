import MissionItem from '@/components/Common/MissionItem';
import Image from 'next/image';
import Link from 'next/link';
// import child_profile from '@/assets/icons/child_profile.svg';
// import level_icon from '@/assets/icons/level.svg';
// import mission_plus from '@/assets/icons/mission_plus.svg';
import CommonModal from '@/components/Common/Modal';
import { useState, useEffect, useRef } from 'react';
import { searchItem, createShopping } from '@/lib/api/shopping';
import { getRouteList, getRouteDetails } from '@/lib/api/navigation';
import {
	getKidDataFromParent,
	getInProgressMissionList,
} from '@/lib/api/parent';
import { useAtom } from 'jotai';
import { userAtom, selectedChildIdAtom } from '@/atoms';
import { useRouter } from 'next/router';
import BottomNavbar from '@/components/Common/Navbar/BottomNavbar';

export default function Index() {
	const [kidInfo, setKidInfo] = useState<KidDataResponseFromParent>();
	// const [currentChildId, setCurrentChildId] = useState<number>();

	const [missions, setMissions] = useState<Mission[]>();

	const [currentStep, setCurrentStep] = useState(1);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedErrand, setSelectedErrand] = useState('');
	const [selectedRouteDetails, setSelectedRouteDetails] = useState<any>(null);
	const [selectedItems, setSelectedItems] = useState<SearchCartItem[]>([]);

	const handleOpenModal = () => setIsModalOpen(true);
	const handleCloseModal = () => {
		setIsModalOpen(false);
		setCurrentStep(1);
		setSelectedErrand('');
		setSelectedItems([]);
	};

	const handleNext = () => setCurrentStep(prev => prev + 1);
	const handlePrev = () => setCurrentStep(prev => prev - 1);

	const [user] = useAtom(userAtom);
	const router = useRouter();
	const [selectedChildId, setSelectedChildId] = useAtom(selectedChildIdAtom);

	// 현재 선택한 아이 정보 가져오기 함수
	const getKidInfo = async (childId: number) => {
		try {
			const kidData: KidDataResponseFromParent =
				await getKidDataFromParent(childId);
			setKidInfo(kidData);
		} catch (error) {
			console.error('데이터를 가져오는 중 오류 발생:', error);
		}
	};

	// 현재 부여된 미션 가져오기 함수
	const getInProgressMissions = async (childId: number) => {
		try {
			const missionData: InProgressMissionResponse[] =
				await getInProgressMissionList(childId);

			if (!missionData) {
				console.error('No mission data received.');
				return;
			} else console.log(missionData);

			// 데이터를 변환하여 mappedMissions로 설정
			const mappedMissions: Mission[] = missionData.map(mission => ({
				type: mission.type,
				content: mission.content,
			}));

			setMissions(mappedMissions);
		} catch (error) {
			console.error('데이터를 가져오는 중 오류 발생:', error);
		}
	};

	// 현재 주소에서 아이디 가져와서 api 조회하기
	// useEffect(() => {
	// 	const url = new URL(window.location.href);
	// 	const id = parseInt(url.pathname.split('/').pop() || '0');
	// 	setCurrentChildId(id);
	// 	getKidInfo(id);
	// 	getInProgressMissions(id);
	// }, []);
	// 사용자 정보 가져오기

	useEffect(() => {
		const { childId } = router.query;

		// 1. childId가 있을 때만 상태 업데이트 및 데이터 fetch
		if (childId && typeof childId === 'string') {
			const numChildId = Number(childId);
			setSelectedChildId(numChildId);

			// 2. 바로 데이터 fetch (userId 체크는 각 API 함수 내부에서 처리)
			getKidInfo(numChildId);
			getInProgressMissions(numChildId);
		}
	}, [router.query, setSelectedChildId]); // userId 의존성 제거

	// 현재 선택된 childId 확인
	console.log('parentId,childId', user.userId, selectedChildId);
	// 각 단계별 컴포넌트
	const StepOne = () => (
		<div className="flex flex-col h-full">
			<h2 className="text-xl font-bold mb-4">심부름 부여하기</h2>
			<div className="flex-1">
				<select
					className="w-full p-2 border rounded"
					onChange={e => setSelectedErrand(e.target.value)}
					value={selectedErrand}
				>
					<option value="">심부름 종류를 선택하세요</option>
					<option value="장보기">장보기</option>
					<option value="재활용">재활용</option>
					<option value="기타">기타</option>
				</select>
			</div>
			<div className="flex justify-between mt-auto">
				<button
					className="px-4 py-2 rounded bg-gray-100 text-gray-500"
					onClick={handleCloseModal}
				>
					이전
				</button>
				{selectedErrand && (
					<button
						className="px-4 py-2 rounded bg-orange_main text-white"
						onClick={handleNext}
					>
						다음
					</button>
				)}
			</div>
		</div>
	);

	const StepTwo = () => {
		const [selectedDestination, setSelectedDestination] = useState('');
		const [destinations, setDestinations] = useState<
			{ objectId: string; buildingName: string }[]
		>([]);
		const [routeDetails, setRouteDetails] = useState<any>(null);
		const mapRef = useRef<any>(null);
		const polylineRef = useRef<any>(null);
		const markersRef = useRef<any[]>([]);

		useEffect(() => {
			// 목적지 목록 가져오기
			const fetchDestinations = async () => {
				try {
					const routeList = await getRouteList();
					// 형식 변경
					const formattedDestinations = routeList.map((route: any) => ({
						objectId: route.objectId,
						buildingName: route.destination.buildingName,
					}));
					setDestinations(formattedDestinations);
				} catch (error) {
					console.error('목적지 정보 가져오기 실패핑:', error);
				}
			};

			fetchDestinations();
		}, []);

		useEffect(() => {
			// 카카오맵 화면 띄우기
			const kakao = (window as any).kakao;
			const initializeMap = (latitude: number, longitude: number) => {
				if (kakao && kakao.maps) {
					kakao.maps.load(() => {
						const mapContainer = document.getElementById('map');
						const mapOptions = {
							center: new kakao.maps.LatLng(latitude, longitude),
							level: 4,
						};
						const mapInstance = new kakao.maps.Map(mapContainer, mapOptions);
						mapRef.current = mapInstance;

						const markerPosition = new kakao.maps.LatLng(latitude, longitude);
						const marker = new kakao.maps.Marker({
							position: markerPosition,
						});
						marker.setMap(mapInstance);
					});
				}
			};

			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
					position => {
						const { latitude, longitude } = position.coords;
						initializeMap(latitude, longitude);
					},
					error => {
						console.error('현재 위치 가져오기 실패핑:', error);
						initializeMap(37.5665, 126.978);
					},
					{ enableHighAccuracy: true },
				);
			} else {
				// 현재 위치 못가져오면 중심 서울로
				initializeMap(37.5665, 126.978);
			}
		}, []);

		// 목적지 선택 함수
		const handleDestinationChange = async (
			e: React.ChangeEvent<HTMLSelectElement>,
		) => {
			const destinationId = e.target.value;
			setSelectedDestination(destinationId);

			try {
				const details = await getRouteDetails(destinationId);
				setRouteDetails(details);
				if ((window as any).kakao && (window as any).kakao.maps) {
					drawRoute(details);
				}
			} catch (error) {
				console.error('경로 상세정보 가져오기 실패핑:', error);
			}
		};

		// 경로 그리는 함수
		const drawRoute = (details: any) => {
			const kakao = (window as any).kakao;

			if (!kakao || !kakao.maps || !mapRef.current) {
				console.error('Kakao Maps SDK is not loaded or map is not initialized');
				return;
			}

			if (polylineRef.current) {
				polylineRef.current.setMap(null);
			}
			markersRef.current.forEach(marker => marker.setMap(null));
			markersRef.current = [];

			const { startPoint, destination, routes } = details;

			const routePoints = [
				new kakao.maps.LatLng(startPoint.latitude, startPoint.longitude),
				...routes.map(
					(route: any) =>
						new kakao.maps.LatLng(route.latitude, route.longitude),
				),
				new kakao.maps.LatLng(destination.latitude, destination.longitude),
			];

			console.log(routePoints);

			const startMarkerImage = new kakao.maps.MarkerImage(
				'/icons/map_home_icon.svg',
				new kakao.maps.Size(40, 40),
				{ offset: new kakao.maps.Point(20, 40) },
			);
			const endMarkerImage = new kakao.maps.MarkerImage(
				'/icons/map_shop_icon.svg',
				new kakao.maps.Size(40, 40),
				{ offset: new kakao.maps.Point(20, 40) },
			);

			const startMarker = new kakao.maps.Marker({
				position: routePoints[0],
				image: startMarkerImage,
			});
			startMarker.setMap(mapRef.current);
			markersRef.current.push(startMarker);

			const endMarker = new kakao.maps.Marker({
				position: routePoints[routePoints.length - 1],
				image: endMarkerImage,
			});
			endMarker.setMap(mapRef.current);
			markersRef.current.push(endMarker);

			const polyline = new kakao.maps.Polyline({
				map: mapRef.current,
				path: routePoints,
				strokeWeight: 5,
				strokeColor: '#FF0000',
				strokeOpacity: 0.7,
				strokeStyle: 'solid',
			});
			polylineRef.current = polyline;

			// 지도 축척
			const bounds = new kakao.maps.LatLngBounds();
			routePoints.forEach(point => bounds.extend(point));
			mapRef.current.setBounds(bounds);

			const sw = bounds.getSouthWest();
			const ne = bounds.getNorthEast();
			console.log('Bounds Southwest:', { lat: sw.getLat(), lng: sw.getLng() });
			console.log('Bounds Northeast:', { lat: ne.getLat(), lng: ne.getLng() });
		};

		return (
			<div className="flex flex-col h-full">
				<h2 className="text-xl font-bold mb-4">경로 설정</h2>
				<div className="flex-1">
					<select
						className="w-full p-2 border rounded"
						onChange={handleDestinationChange}
						value={selectedDestination}
					>
						<option value="">목적지를 선택하세요</option>
						{destinations.map(destination => (
							<option key={destination.objectId} value={destination.objectId}>
								{destination.buildingName}
							</option>
						))}
					</select>
				</div>

				<div
					id="map"
					className="mt-4"
					style={{ width: '100%', height: '400px' }}
					ref={mapRef}
				></div>
				<div className="flex justify-between mt-auto">
					<button
						className="px-4 py-2 rounded bg-gray-100 text-gray-500"
						onClick={handlePrev}
					>
						이전
					</button>
					<button
						className="px-4 py-2 rounded bg-orange-400 text-white"
						onClick={() => {
							setSelectedRouteDetails(routeDetails);
							handleNext();
						}}
						disabled={!selectedDestination}
					>
						다음
					</button>
				</div>
			</div>
		);
	};

	const SearchContent = ({
		onClose,
		onItemSelect,
	}: {
		onClose: () => void;
		onItemSelect: (item: any) => void;
	}) => {
		const [itemName, setItemName] = useState('');
		const [searchResults, setSearchResults] = useState<
			ItemSearchResponse[] | []
		>([]);
		const PAGE_SIZE = 5;

		const handleSearch = async () => {
			try {
				const result = await searchItem(itemName, 0, PAGE_SIZE);
				setSearchResults(result);
				console.log(result);
			} catch (error) {
				console.error('검색 중 오류 발생:', error);
				setSearchResults([]);
			}
		};

		return (
			<div className="flex flex-col h-full">
				<h2 className="text-xl font-bold text-center m-4">검색 결과</h2>
				<div className="relative mb-4">
					<input
						type="text"
						className="w-full p-2 border rounded"
						placeholder="물품을 검색해보세요"
						value={itemName}
						onChange={e => setItemName(e.target.value)}
						onKeyPress={e => e.key === 'Enter' && handleSearch()}
					/>
					<button
						onClick={handleSearch}
						className="absolute right-3 top-1/2 transform -translate-y-1/2"
					>
						🔍
					</button>
				</div>

				<div className="text-sm text-gray-500 mb-2">
					찾고 있는 물건이 없나요? +
				</div>

				<div className="flex-1 overflow-y-auto space-y-2">
					{searchResults.map((item: any, index: number) => (
						<div
							key={index}
							className="flex items-center space-x-3 p-2 border rounded-lg"
						>
							<div className="w-16 h-16 rounded-lg overflow-hidden">
								<Image
									src={item.image}
									alt={item.productName || '상품 이미지'}
									width={64}
									height={64}
									className="object-cover"
								/>
							</div>
							<div className="flex-1">
								<div className="font-medium">{item.productName}</div>
							</div>
							<button
								onClick={() => {
									onItemSelect(item);
									onClose();
								}}
								className="px-4 py-2 bg-orange-100 text-orange_main rounded-lg text-sm"
							>
								담기
							</button>
						</div>
					))}
				</div>
			</div>
		);
	};

	const StepThree = () => {
		const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
		// const [selectedItems, setSelectedItems] = useState<CartItem[]>([]);

		const handleItemSelect = (item: ItemSearchResponse) => {
			setSelectedItems(prev => {
				const existingItem = prev.find(i => i.barcode === item.barcode);
				if (existingItem) {
					return prev.map(i =>
						i.barcode === item.barcode ? { ...i, quantity: i.quantity + 1 } : i,
					);
				}
				return [...prev, { ...item, quantity: 1 }];
			});
		};

		const handleQuantityChange = (barcode: string, delta: number) => {
			setSelectedItems(prev =>
				prev
					.map(item => {
						if (item.barcode === barcode) {
							const newQuantity = Math.max(0, item.quantity + delta);
							return { ...item, quantity: newQuantity };
						}
						return item;
					})
					.filter(item => item.quantity > 0),
			);
		};

		const handleDelete = (barcode: string) => {
			setSelectedItems(prev => prev.filter(item => item.barcode !== barcode));
		};

		const handleStepThreePrev = () => {
			setSelectedItems([]);
			handlePrev();
		};

		return (
			<div className="flex flex-col h-full">
				<h2 className="text-xl font-bold text-center m-4">장바구니 설정</h2>
				<div className="relative mb-4">
					<input
						type="text"
						className="w-full p-2 border rounded"
						placeholder="물품을 검색해보세요"
						onClick={() => setIsSearchModalOpen(true)}
						readOnly
					/>
					<button
						className="absolute right-2 top-1/2 transform -translate-y-1/2"
						onClick={() => setIsSearchModalOpen(true)}
					>
						🔍
					</button>
				</div>

				<div className="ml-2 mb-2">장바구니 목록</div>
				<div className="flex-1 overflow-y-auto">
					{selectedItems.map(item => (
						<div
							key={item.barcode}
							className="flex items-center space-x-3 p-2 border rounded-lg mb-2"
						>
							<div className="flex aligh-center w-16 h-16">
								<Image
									src={item.image}
									alt={item.productName}
									width={64}
									height={64}
									className="object-cover"
								/>
							</div>
							<div className="flex max-w-[90px]">
								<div className="text-sm">{item.productName}</div>
							</div>
							<div className="flex items-center w-[100px]">
								<button
									onClick={() => handleQuantityChange(item.barcode, -1)}
									className="w-4 h-4 rounded-full bg-light_yellow_dark flex items-center justify-center"
								>
									-
								</button>
								<span className="w-8 text-center text-sm">{item.quantity}</span>
								<button
									onClick={() => handleQuantityChange(item.barcode, 1)}
									className="w-4 h-4 rounded-full bg-light_yellow_dark flex items-center justify-center"
								>
									+
								</button>
								<button
									onClick={() => handleDelete(item.barcode)}
									className="ml-2 w-12 h-6 bg-orange-100 text-orange_main rounded-lg text-sm"
								>
									삭제
								</button>
							</div>
						</div>
					))}
				</div>

				<CommonModal
					isOpen={isSearchModalOpen}
					onClose={() => setIsSearchModalOpen(false)}
					size="large"
				>
					<SearchContent
						onClose={() => setIsSearchModalOpen(false)}
						onItemSelect={handleItemSelect}
					/>
				</CommonModal>

				<div className="flex justify-between mt-4">
					<button
						className="px-4 py-2 rounded bg-gray-100 text-gray-500"
						onClick={handleStepThreePrev}
					>
						이전
					</button>
					<button
						className="px-4 py-2 rounded bg-orange_main text-white"
						onClick={handleNext}
					>
						다음
					</button>
				</div>
			</div>
		);
	};
	const ShoppingConfirmation = () => {
		const handleComplete = async () => {
			try {
				if (!selectedRouteDetails) {
					throw new Error('Route details are not available');
				}

				const requestBody: ShoppingRequest = {
					parentId: user.userId,
					childId: selectedChildId!,
					startPoint: selectedRouteDetails.startPoint,
					destination: selectedRouteDetails.destination,
					route: selectedRouteDetails.routes,
					shoppingList: selectedItems.map(item => ({
						barcode: item.barcode,
						quantity: item.quantity,
					})),
				};

				await createShopping(requestBody);
				if (selectedChildId) {
					await getInProgressMissions(selectedChildId);
				}
				handleCloseModal();
			} catch (error) {
				console.error('Failed to create shopping mission:', error);
			}
		};
		return (
			<div className="flex flex-col h-full">
				<h3 className="text-xl font-bold text-center m-4 mb-6">
					심부름 정보가 <br />
					맞는지 확인해주세요!
				</h3>
				<span className="font-bold ml-2 mb-2">목적지</span>
				<div className="p-2  border-2 border-light_yellow_dark rounded-xl mb-5 ml-1">
					{selectedRouteDetails.destination.buildingName}
				</div>
				<span className="font-bold ml-2 mb-3">장바구니</span>
				<div className="overflow-y-auto">
					<div className="grid grid-cols-2 gap-2">
						{selectedItems.map(item => (
							<div
								key={item.barcode}
								className="bg-white p-3 rounded-3xl shadow-md"
							>
								<div className="flex justify-center mb-2">
									<Image
										src={item.image}
										alt={item.productName}
										width={40}
										height={40}
										className="object-cover"
									/>
								</div>
								<div className="text-center">
									<p className="text-sm mb-1 truncate">{item.productName}</p>
									<p className="text-sm text-gray-500">
										수량: {item.quantity}개
									</p>
								</div>
							</div>
						))}
					</div>
					<div className="flex justify-between mt-10">
						<button
							className="px-4 py-2 rounded bg-gray-100 text-gray-500"
							onClick={handlePrev}
						>
							이전
						</button>
						<button
							className="px-4 py-2 rounded bg-orange_main text-white"
							onClick={handleComplete}
						>
							완료
						</button>
					</div>
				</div>
			</div>
		);
	};

	// 각 단계별 모달 사이즈 정의
	const getModalSize = (step: number) => {
		switch (step) {
			case 1:
				return 'small';
			case 2:
				return 'medium';
			case 3:
				return 'large';
			case 4:
				return 'large';
			default:
				return 'medium';
		}
	};

	const ErrandConfirmation = () => (
		<div className="flex flex-col h-full">
			<h2 className="text-xl font-bold mb-4">
				김애기에게 다음의
				<br />
				심부름을 부여하시겠어요?
			</h2>
			<div className="flex-1">
				<input
					type="text"
					className="w-full p-2 border rounded"
					value={selectedErrand}
					readOnly
				/>
			</div>
			<div className="flex justify-between mt-auto gap-2">
				<button
					className="flex-1 px-4 py-2 rounded bg-gray-100 text-gray-500"
					onClick={handlePrev}
				>
					이전
				</button>
				<button
					className="flex-1 px-4 py-2 rounded bg-orange_main text-white"
					onClick={handleCloseModal}
				>
					완료
				</button>
			</div>
		</div>
	);

	// 현재 단계와 선택된 심부름에 따른 컨텐츠 렌더링
	const renderContent = () => {
		if (currentStep === 1) {
			return <StepOne />;
		}

		if (selectedErrand === '장보기') {
			switch (currentStep) {
				case 2:
					return <StepTwo />;
				case 3:
					return <StepThree />;
				case 4:
					return <ShoppingConfirmation />;
				default:
					return null;
			}
		} else {
			return <ErrandConfirmation />;
		}
	};

	return (
		<>
			<div className="flex flex-col w-full max-w-md mx-auto bg-light_yellow background min-h-screen pb-24">
				{/* 알림 아이콘 */}
				<div className="flex justify-end m-3 mr-5">
					<Link href={`/parents/${selectedChildId}/notification`}>
						<div className="bg-white rounded-xl shadow-sm flex items-center justify-center">
							<Image
								src="/icons/notification.svg"
								alt="notification"
								width={50}
								height={50}
							/>
						</div>
					</Link>
				</div>
				{/* 안내문구 */}
				<div className="text-xl font-medium mb-6 ml-10">
					<span className="font-bold">{kidInfo?.name}</span>의 성장을 위해,
					<br />
					오늘은 어떤 심부름을 시켜볼까요?
				</div>
				{/* 아이정보 */}
				<div className="flex justify-center items-center">
					<div className="w-[330px] bg-light_yellow_dark rounded-2xl p-6 mb-4">
						<h2 className="text-lg font-bold mb-4">아이 정보</h2>
						<div className="flex justify-center items-center gap-4">
							<div className="flex flex-col">
								<Image
									src="/icons/child_profile.svg"
									alt="child profile"
									width={80}
									height={80}
									className="rounded-full mb-4"
								/>
								<div className="flex w-[70px] bg-white rounded-lg justify-center items-center gap-1">
									<Image
										src="/icons/level.svg"
										alt="level"
										width={20}
										height={20}
									/>
									<span className="text-sm font-bold">Lv.{kidInfo?.level}</span>
								</div>
							</div>
							<div className="flex flex-col gap-1">
								<div className="flex items-center gap-2">
									<span className="text-gray-600">이름:</span>
									<span className="font-medium">{kidInfo?.name}</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-gray-600">닉네임:</span>
									<span>{kidInfo?.nickname}</span>
								</div>
								<div className="flex items-start gap-2">
									<span className="text-gray-600 min-w-10">주소:</span>
									<span className="max-w-30 break-words">
										{kidInfo?.address}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-gray-600">연락처:</span>
									<span>{kidInfo?.tel}</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* 심부름 목록 */}
				<div>
					<div className="flex ml-8 mb-4 gap-2">
						<h2 className="text-lg font-bold">심부름 목록</h2>
						<button className="w-6 h-6 rounded-lg shadow-sm flex items-center justify-center">
							<Image
								src="/icons/mission_plus.svg"
								alt="mission_plus"
								width={24}
								height={24}
								onClick={handleOpenModal}
							/>
						</button>
					</div>
					<div className="flex flex-col items-center h-[260px] overflow-y-auto px-4">
						{missions?.map((mission, index) => (
							<MissionItem
								key={index}
								type={mission.type}
								content={mission.content}
								onClick={() =>
									console.log(`Clicked mission: ${mission.content}`)
								}
							/>
						))}
					</div>
				</div>
				<CommonModal
					isOpen={isModalOpen}
					onClose={handleCloseModal}
					size={getModalSize(currentStep)}
					hideBackdrop={false}
				>
					{renderContent()}
				</CommonModal>
			</div>
			<BottomNavbar />
		</>
	);
}
