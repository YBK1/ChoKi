import { atom } from 'jotai';

// shoppingList Atom 정의
export const shoppingListAtom = atom<ShoppingItem[]>([]);
export const shoppingMessageAtom = atom<string>('');
export const shoppingIdAtom = atom<string | null>(null);
// shoppingList에 새로운 아이템을 추가하는 함수
export const addShoppingItem = (
	set: (update: (prev: ShoppingItem[]) => ShoppingItem[]) => void,
	newItem: ShoppingItem,
) => {
	set((prevList: ShoppingItem[]) => [...prevList, newItem]);
};

// 특정 barcode의 cartItem을 업데이트하는 함수
export const updateCartItemInShoppingList = (
	set: (update: (prev: ShoppingItem[]) => ShoppingItem[]) => void,
	barcode: string,
	updatedCartItem: CartItem,
) => {
	set((prevList: ShoppingItem[]) =>
		prevList.map((item: ShoppingItem) =>
			item.barcode === barcode ? { ...item, cartItem: updatedCartItem } : item,
		),
	);
};

// 특정 barcode의 cartItem을 삭제하는 함수
// 특정 barcode의 cartItem을 삭제하고, productName이 빈 문자열인 ShoppingItem을 삭제하는 함수
export const deleteCartItemAndCheckEmptyProductName = (
	set: (update: (prev: ShoppingItem[]) => ShoppingItem[]) => void,
	barcode: string,
) => {
	set((prevList: ShoppingItem[]) =>
		prevList
			.map((item: ShoppingItem) =>
				item.barcode === barcode ? { ...item, cartItem: undefined } : item,
			)
			.filter(
				(item: ShoppingItem) =>
					!(item.barcode === barcode && item.productName.trim() === ''), // barcode와 productName 조건에 일치하는 아이템만 삭제
			),
	);
};

// shoppingMessageAtom의 메시지를 업데이트하는 함수
export const updateShoppingMessage = (
	setMessage: (update: (prev: string) => string) => void,
	newMessage: string,
) => {
	setMessage(() => newMessage);
};
