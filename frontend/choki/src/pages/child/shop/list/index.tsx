import Modal from '@/components/Common/Modal/nonCloseModalLarge';
import Navbar from '@/components/Common/Navbar/UpperNavbar';
import Image from 'next/image';
import ShoppingCharacter from '@/assets/icons/shopping_character.svg';
import SpeechBubble from '@/components/shop/SpeechBubble';
import ProductCard from '@/components/shop/ProductCard';
import { useAtom } from 'jotai';
import { shoppingListAtom } from '@/atoms/shoppingAtom';
import { useEffect } from 'react';
import { childWebSocketClient } from '@/lib/ws/WebSocketClient';
import * as StompJs from '@stomp/stompjs';

export default function ChildShoppingPage() {
	const [shoppingList, setShoppingList] = useAtom(shoppingListAtom);

	useEffect(() => {
		console.log('Shopping list:', shoppingList);
	}, [shoppingList]);

	// WebSocket을 통해 shoppingList 업데이트
	useEffect(() => {
		// WebSocket 메시지 수신 및 shoppingListAtom 업데이트 함수
		const handleWebSocketMessage = (message: StompJs.Message) => {
			console.log('Received message:', message.body);
			const data = JSON.parse(message.body);

			// 수신한 메시지가 쇼핑 목록을 포함하는 경우 상태 업데이트
			if (data && data.shoppingList) {
				console.log('Updating shoppingListAtom with:', data.shoppingList);
				setShoppingList(data.shoppingList); // shoppingListAtom 업데이트
			} else {
				console.log('Received data without shoppingList:', data);
			}
		};

		// WebSocket 구독 설정
		childWebSocketClient.subscribe(
			'/user/sub/shopping/672df1def4c5cb7ca5d36532', // 구독할 경로 설정
			handleWebSocketMessage, // 수신 메시지 처리 함수
		);

		// 컴포넌트 언마운트 시 WebSocket 연결 해제
		return () => {
			childWebSocketClient.disconnect();
		};
	}, [setShoppingList]);

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
				<Modal>
					<div className="flex flex-col items-center">
						<h1 className="text-2xl font-bold mb-6">장바구니</h1>
						{/* ProductCard를 사용해 shoppingList 데이터를 렌더링 */}
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
										: undefined // cartItem이 null일 경우 ChildrenShoppingItem을 undefined로 설정
								}
							/>
						))}
					</div>
				</Modal>
			</div>

			{/* 말풍선 컴포넌트 사용 */}
			<div className="absolute bottom-24 right-32">
				<SpeechBubble speech="바코드가 보이게 찍어줘!" />
			</div>

			{/* 장보기 캐릭터 이미지 */}
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
