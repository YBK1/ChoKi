import Modal from '@/components/Common/Modal/nonCloseModalLarge';
import Navbar from '@/components/Common/Navbar/UpperNavbar';
import Image from 'next/image';
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
	const [barcodeData, setBarcodeData] = useState<string | null>(null);

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

	const handleCaptureImage = (imageDataUrl: string) => {
		setBarcodeData(imageDataUrl);
		closeCameraModal();
	};

	const openCameraModal = () => {
		setIsCameraOpen(true);
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
									onCameraClick={openCameraModal}
								/>
							))}
							{barcodeData && (
								<p className="mt-4 text-lg text-green-600">
									인식된 바코드: {barcodeData}
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
				src="/icons/shopping_character.svg"
				alt="장보기 캐릭터"
				className="absolute bottom-16 right-4"
				width={100}
				height={100}
			/>
		</div>
	);
}
