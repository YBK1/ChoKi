type WSShoppingType =
	| 'SHOPPING'
	| 'ADD_PRODUCT_TO_CART'
	| 'DELETE_PRODUCT_FROM_CART'
	| 'HINT_MESSAGE';

type addReason = SOLD_OUT | NO_REASON | BLANK;
interface WSShoppingResponse {
	type: WSShoppingType;
	id: string;
	parentId: number;
	childId: number;
	startPoint: ShoppingLocation;
	destination: ShoppingLocation;
	routes: RoutePoint[];
	shoppingList: ShoppingItem[];
	missionId: string;
	status: string;
}

interface addShoppingItem {
	shoppingId: string;
	listBarcode: string;
	barcode: string;
	quantity: number;
	reason: addReason;
}
