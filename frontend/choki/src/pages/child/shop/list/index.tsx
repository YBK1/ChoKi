import Modal from '@/components/Common/Modal/nonCloseModalLarge';
import Navbar from '@/components/Common/Navbar/UpperNavbar';
import Image from 'next/image';
import ShoppingCharacter from '@/assets/icons/shopping_character.svg';
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
import { handleWebSocketMessage } from '@/lib/utils/websocketChild/ChildShoppingSoket';

export default function ChildShoppingPage() {
	const [shoppingList, setShoppingList] = useAtom(shoppingListAtom);
	const [shoppingMessage, setShoppingMessage] = useAtom(shoppingMessageAtom);
	const [isCameraOpen, setIsCameraOpen] = useState(false);
	const [originBarcode, setOriginBarcode] = useState<string | null>(null);
	const [productName, setProductName] = useState<string | null>(null);

	// WebSocket 구독 및 메시지 처리
	useEffect(() => {
		childWebSocketClient.subscribe(
			'/user/sub/shopping/672df1def4c5cb7ca5d36532',
			message =>
				handleWebSocketMessage(message, setShoppingList, setShoppingMessage),
		);

		// 컴포넌트가 언마운트될 때 WebSocket 연결 해제
		return () => {
			childWebSocketClient.disconnect();
		};
	}, [setShoppingList]);
	useEffect(() => {
		console.log('shoppingList', shoppingList);
	}, [shoppingList]);

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
	// 부모 리스트에 없는 아이템 추가 일단 주석처리
	// const updateCartItem = (barcode: string, updatedCartItem: CartItem) => {
	// 	setShoppingList(prevList =>
	// 		prevList.map(item =>
	// 			item.barcode === barcode
	// 				? { ...item, cartItem: updatedCartItem }
	// 				: item,
	// 		),
	// 	);
	// };

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
						</div>
					</Modal>
				)}
			</div>

			<div className="absolute bottom-24 right-32">
				<SpeechBubble speech={shoppingMessage} />
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
