import Modal from '@/components/Common/Modal/nonCloseModalLarge';
import Navbar from '@/components/Common/Navbar/UpperNavbar';
import Image from 'next/image';
import ShoppingCharacter from '@/assets/icons/shopping_character.svg';
import SpeechBubble from '@/components/shop/SpeechBubble';
import ProductCard from '@/components/shop/ProductCard';
import Cam from '@/components/shop/BarcodeCam';
import { useAtom } from 'jotai';
import { shoppingListAtom } from '@/atoms/shoppingAtom';
import { useEffect, useState } from 'react';
import { childWebSocketClient } from '@/lib/ws/WebSocketClient';
import { compareItems } from '@/lib/api/kid';
import * as StompJs from '@stomp/stompjs';

export default function ChildShoppingPage() {
	const [shoppingList, setShoppingList] = useAtom(shoppingListAtom);
	const [isCameraOpen, setIsCameraOpen] = useState(false);
	const [barcodeData, setBarcodeData] = useState<string | null>(null);
	const [selectedBarcode, setSelectedBarcode] = useState<string | null>(null);
	const [comparisonResult, setComparisonResult] = useState<string | null>(null);

	useEffect(() => {
		console.log('Shopping list:', shoppingList);
	}, [shoppingList]);

	useEffect(() => {
		const handleWebSocketMessage = (message: StompJs.Message) => {
			const data = JSON.parse(message.body);
			if (data && data.shoppingList) {
				setShoppingList(data.shoppingList);
			}
		};

		childWebSocketClient.subscribe(
			'/user/sub/shopping/672df1def4c5cb7ca5d36532',
			handleWebSocketMessage,
		);

		return () => {
			childWebSocketClient.disconnect();
		};
	}, [setShoppingList]);

	const handleCaptureImage = async (imageDataUrl: string) => {
		setBarcodeData(imageDataUrl);
		closeCameraModal();

		if (selectedBarcode) {
			try {
				// compareItems 함수 호출로 서버에 비교 요청
				const response = await compareItems({
					originBarcode: selectedBarcode,
					inputBarcode: barcodeData!,
				});
				setComparisonResult(response.status); // 서버 응답 상태를 상태에 저장
				console.log('compareItems response:', response);
			} catch (error) {
				console.error('바코드 비교 중 오류 발생:', error);
				setComparisonResult('비교 실패');
			}
		} else {
			console.log('선택된 바코드가 없습니다.');
			setComparisonResult('선택된 항목 없음');
		}
	};

	const openCameraModal = (barcode: string) => {
		setSelectedBarcode(barcode); // 선택된 상품의 바코드를 저장
		setIsCameraOpen(true);
		console.log('클릭한 상품의 바코드:', barcode); // 클릭한 상품의 바코드 출력
	};

	const closeCameraModal = () => {
		setIsCameraOpen(false);
	};

	return (
		<div
			className="relative flex flex-col items-center min-h-screen bg-cover bg-center"
			style={{
				backgroundImage: `url('/icons/mart_background.svg')`,
			}}
		>
			<div className="mt-8">
				<Navbar />
			</div>
			<div className="flex flex-col items-center">
				{isCameraOpen ? (
					<Cam
						onCaptureChange={closeCameraModal}
						onCaptureImage={handleCaptureImage}
					/>
				) : (
					<Modal>
						<div className="flex flex-col items-center">
							<h1 className="text-2xl font-bold mb-6">장바구니</h1>
							{shoppingList.map(item => (
								<ProductCard
									key={item.barcode}
									role="CHILD"
									ParentsShoppingItem={{
										title: item.productName,
										count: item.quantity,
										image: item.image,
									}}
									ChildrenShoppingItem={
										item.cartItem
											? {
													title: item.cartItem.productName,
													count: item.cartItem.quantity,
													image: item.cartItem.image,
												}
											: undefined
									}
									onCameraClick={() => openCameraModal(item.barcode)} // 바코드를 전달하여 클릭 시 콘솔에 출력
								/>
							))}
							{barcodeData && (
								<p className="mt-4 text-lg text-green-600">
									인식된 바코드: {barcodeData}
								</p>
							)}
							{comparisonResult && (
								<p className="mt-2 text-lg text-blue-600">
									비교 결과: {comparisonResult}
								</p>
							)}
						</div>
					</Modal>
				)}
			</div>

			<div className="absolute bottom-24 right-32">
				<SpeechBubble speech="바코드가 보이게 찍어줘!" />
			</div>

			<Image
				src={ShoppingCharacter}
				alt="장보기 캐릭터"
				className="absolute bottom-16 right-4"
				width={100}
				height={100}
			/>
		</div>
	);
}
