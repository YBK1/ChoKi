import { atom } from 'jotai';

// shoppingList Atom 정의
export const shoppingListAtom = atom<ShoppingItem[]>([]);

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
export const deleteCartItemInShoppingList = (
	set: (update: (prev: ShoppingItem[]) => ShoppingItem[]) => void,
	barcode: string,
) => {
	set((prevList: ShoppingItem[]) =>
		prevList.map((item: ShoppingItem) =>
			item.barcode === barcode ? { ...item, cartItem: undefined } : item,
		),
	);
};
