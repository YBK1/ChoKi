//http 관련 타입, Request, Response 뒤에 붙이기
type role = 'PARENT' | 'CHILD';
interface SignupRequest {
	userId: string;
	userPassword: string;
	nickname: string;
	address: string;
	latitude: number;
	longitude: number;
	name: string;
	tel: string;
	role: role;
}
interface LoginRequest {
	userId: string;
	userPassword: string;
}

interface LoginResponse {
	role: string;
}
interface InviteCodeResponse {
	inviteCode: string;
}
interface JoinFamilyResponse {
	invite_code: string;
}

// export interface BaseResponse<T> {
// 	status: number;
// 	message: string;
// 	data: T;
// }

interface NotificationResponse {
	childId: number;
	content: string;
	type: MissionType;
	id: number;
	time: string;
}

interface ItemSearchResponse {
	barcode: string;
	category: string;
	productName: string;
	image: string;
}

interface Child {
	childId: number;
	name: string;
	nickname: string;
	level: number;
	address: string;
}

interface FamilyResponse {
	status: number;
	message: string;
	data: {
		username: string;
		children: Child[];
	};
}

interface ShoppingRequset {
	parentId: number;
	childId: number;
	startPoint: ShoppingLocation;
	destination: ShoppingLocation;
	route: RoutePoint[];
	shoppingList: ReturnType<typeof getShoppingList>;
}
