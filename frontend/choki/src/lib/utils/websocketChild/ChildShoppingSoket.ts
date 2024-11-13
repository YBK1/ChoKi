import * as Stomp from '@stomp/stompjs';
import {
	updateCartItemInShoppingList,
	updateShoppingMessage,
} from '@/atoms/shoppingAtom';

// WebSocket 메시지를 처리하는 함수
export const handleWebSocketMessage = (
	message: Stomp.Message,
	setShoppingList: (update: (prev: CartItem[]) => CartItem[]) => void,
	setShoppingMessage: (update: (prev: string) => string) => void,
) => {
	const data = JSON.parse(message.body);
	console.log('WebSocket message received:', data);
	if (data && data.shoppingList) {
		setShoppingList(data.shoppingList);
	}
	switch (data.type) {
		case 'ADD_PRODUCT_TO_CART':
			const updatedCartItem: CartItem = {
				barcode: data.barcode,
				category: '', // 필요한 경우 기존 category 유지
				productName: data.productName,
				image: data.image,
				quantity: data.quantity,
				reason: data.reason,
				status: data.status,
			};
			// 웹 소켓으로 데이터 갱신을 받을 경우 바로 jotai를 통해 업데이트하도록
			updateCartItemInShoppingList(
				setShoppingList,
				data.listBarcode,
				updatedCartItem,
			);
			break;

		case 'HINT_MESSAGE':
			// HINT_MESSAGE 타입의 메시지일 경우 shoppingMessageAtom에 메시지 설정
			if (data.message) {
				updateShoppingMessage(setShoppingMessage, data.message);
			}
			break;
	}
};
