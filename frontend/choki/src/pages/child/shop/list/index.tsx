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
import * as StompJs from '@stomp/stompjs';

export default function ChildShoppingPage() {
	const [shoppingList, setShoppingList] = useAtom(shoppingListAtom);
	const [isCameraOpen, setIsCameraOpen] = useState(false);
	const [originBarcode, setOriginBarcode] = useState<string | null>(null);
	const [productName, setProductName] = useState<string | null>(null); // productName 상태 추가

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

	const openCameraModal = (barcode: string, name: string) => {
		setOriginBarcode(barcode); // 클릭된 barcode를 originBarcode로 설정
		setProductName(name); // 클릭된 상품명을 productName으로 설정
		setIsCameraOpen(true);
	};

	const closeCameraModal = () => {
		setIsCameraOpen(false);
		setOriginBarcode(null); // 카메라 모달 닫힐 때 originBarcode 초기화
		setProductName(null); // 카메라 모달 닫힐 때 productName 초기화
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
			<div className="flex flex-col items-center justify-start mt-16">
				{' '}
				{/* justify-start와 mt-16 추가 */}
				{isCameraOpen ? (
					<Cam
						onCaptureChange={closeCameraModal}
						originBarcode={originBarcode || ''}
						productName={productName || ''}
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
									onCameraClick={() =>
										openCameraModal(item.barcode, item.productName)
									} // barcode와 productName을 매개변수로 전달
								/>
							))}
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
