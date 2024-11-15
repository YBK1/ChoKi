import Modal from '@/components/Common/Modal/nonCloseModalLarge';
import Navbar from '@/components/Common/Navbar/YellowUpperNavbar';
import Image from 'next/image';
import SpeechBubble from '@/components/shop/SpeechBubble';
import ProductCard from '@/components/shop/ProductCard';
import Cam from '@/components/shop/BarcodeCam';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import {
	shoppingListAtom,
	deleteCartItemInShoppingList,
	shoppingMessageAtom,
	missionIdAtom,
} from '@/atoms/shoppingAtom';
import { useEffect, useState } from 'react';
import { childWebSocketClient } from '@/lib/ws/WebSocketClient';
import { handleWebSocketMessage } from '@/lib/utils/websocketChild/ChildShoppingSoket';
import AddItemPrompt from '@/components/shop/AddItemPrompt';

export default function ChildShoppingPage() {
	const [shoppingList, setShoppingList] = useAtom(shoppingListAtom);
	const [shoppingMessage, setShoppingMessage] = useAtom(shoppingMessageAtom);
	const [isCameraOpen, setIsCameraOpen] = useState(false);
	const [originBarcode, setOriginBarcode] = useState<string | null>(null);
	const [productName, setProductName] = useState<string | null>(null);
	const router = useRouter();
	const [, setMissionId] = useAtom(missionIdAtom);
	const { missionId } = router.query;

	// WebSocket 구독 및 메시지 처리
	useEffect(() => {
		if (typeof missionId === 'string') {
			setMissionId(missionId);
			childWebSocketClient.subscribe(
				`/user/sub/shopping/${missionId}`,
				message =>
					handleWebSocketMessage(message, setShoppingList, setShoppingMessage),
			);
		}
		return () => {
			childWebSocketClient.disconnect();
		};
	}, [missionId, setShoppingList]);

	const openCameraModal = (barcode: string = '', name: string = '') => {
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
							<AddItemPrompt onClick={() => openCameraModal()} />
						</div>
					</Modal>
				)}
			</div>

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
