import Modal from '@/components/Common/Modal/nonCloseModalLarge';
import Navbar from '@/components/Common/Navbar/UpperNavbar';
import Image from 'next/image';
import SpeechBubble from '@/components/shop/SpeechBubble';
import ProductCard from '@/components/shop/ProductCard';
import Cam from '@/components/shop/BarcodeCam';

import { useAtom } from 'jotai';
import {
	shoppingListAtom,
	deleteCartItemInShoppingList,
	shoppingMessageAtom,
} from '@/atoms/shoppingAtom';
import { useEffect, useState } from 'react';
import { childWebSocketClient } from '@/lib/ws/WebSocketClient';
<<<<<<< HEAD:frontend/choki/src/pages/child/shop/list/index.tsx
import { handleWebSocketMessage } from '@/lib/utils/websocketChild/ChildShoppingSoket';

const AddItemPrompt = () => (
	<div className="flex items-center justify-center p-4 rounded-lg shadow-lg bg-light_yellow_kid mt-4 w-full max-w-md mx-auto">
		<span className="text-lg font-semibold mr-2">물건을 추가로 담을래요!</span>
		<Image
			src="/icons/carmera_icon.svg"
			alt="Camera Icon"
			width={24}
			height={24}
		/>
	</div>
);
=======
import * as StompJs from '@stomp/stompjs';
import { useRouter } from 'next/router';
>>>>>>> ad91bb95f383d35c40bb75ca7d79e8f4528ea7c8:frontend/choki/src/pages/child/shop/[missionId]/list/index.tsx

export default function ChildShoppingPage() {
	const [shoppingList, setShoppingList] = useAtom(shoppingListAtom);
	const [shoppingMessage, setShoppingMessage] = useAtom(shoppingMessageAtom);
	const [isCameraOpen, setIsCameraOpen] = useState(false);
<<<<<<< HEAD:frontend/choki/src/pages/child/shop/list/index.tsx
	const [originBarcode, setOriginBarcode] = useState<string | null>(null);
	const [productName, setProductName] = useState<string | null>(null);
=======
	const [barcodeData, setBarcodeData] = useState<string | null>(null);
	const router = useRouter();

	const { missionId } = router.query;
>>>>>>> ad91bb95f383d35c40bb75ca7d79e8f4528ea7c8:frontend/choki/src/pages/child/shop/[missionId]/list/index.tsx

	// WebSocket 구독 및 메시지 처리
	useEffect(() => {
		childWebSocketClient.subscribe(
<<<<<<< HEAD:frontend/choki/src/pages/child/shop/list/index.tsx
			'/user/sub/shopping/672df1def4c5cb7ca5d36532',
			message =>
				handleWebSocketMessage(message, setShoppingList, setShoppingMessage),
=======
			`/user/sub/shopping/${missionId}`,
			handleWebSocketMessage,
>>>>>>> ad91bb95f383d35c40bb75ca7d79e8f4528ea7c8:frontend/choki/src/pages/child/shop/[missionId]/list/index.tsx
		);

		// 컴포넌트가 언마운트될 때 WebSocket 연결 해제
		return () => {
			childWebSocketClient.disconnect();
		};
	}, [missionId, setShoppingList]);

	const openCameraModal = (barcode: string, name: string) => {
		setOriginBarcode(barcode);
		setProductName(name);
		setIsCameraOpen(true);
	};

	const closeCameraModal = () => {
		setIsCameraOpen(false);
		setOriginBarcode(null);
		setProductName(null);
	};

	const addNewItemToShoppingList = (newItem: CartItem) => {
		setShoppingList(prevList => [...prevList, newItem]);
	};

	const deleteItemFromShoppingList = (barcode: string) => {
		console.log('deleteItemFromShoppingList', barcode);
		deleteCartItemInShoppingList(setShoppingList, barcode);
	};

	return (
		<div
			className="relative flex flex-col items-center min-h-screen bg-cover bg-center"
			style={{
				backgroundImage: `url('/icons/mart_background.svg')`,
			}}
		>
			<div className="mt-8">
				<Navbar missionId={missionId as string} />
			</div>
			<div className="flex flex-col items-center justify-start mt-16">
				{isCameraOpen ? (
					<Cam
						onCaptureChange={closeCameraModal}
						originBarcode={originBarcode || ''}
						productName={productName || ''}
						onClose={closeCameraModal}
						addNewItem={addNewItemToShoppingList}
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
										barcode: item.barcode,
									}}
									ChildrenShoppingItem={
										item.cartItem
											? {
													productName: item.cartItem.productName,
													quantity: item.cartItem.quantity,
													image: item.cartItem.image,
													barcode: item.cartItem?.barcode || '',
													category: item.cartItem.category,
												}
											: undefined
									}
									onCameraClick={() =>
										openCameraModal(item.barcode, item.productName)
									}
									onDelete={deleteItemFromShoppingList}
								/>
							))}
							{/* 항상 표시되는 추가 UI 요소 */}
							<AddItemPrompt />
						</div>
					</Modal>
				)}
			</div>

			{/* 쇼핑 메시지가 있을 때만 SpeechBubble 표시 */}
			{shoppingMessage && (
				<div className="absolute bottom-24 right-32">
					<SpeechBubble speech={shoppingMessage} />
				</div>
			)}
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
