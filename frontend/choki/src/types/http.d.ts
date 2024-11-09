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

interface KidDataResponse {
	id: string;
	nickname: string;
	address: string;
	name: string;
	tel: string;
	role: 'PARENT' | 'CHILD';
	inviteCode: string;
	familyId: number;
	level: number;
	exp: number;
	pastLevel: number;
	mainAnimal: number;
	animals: number[];
}

// 웹 소켓 연결 관련 타입
interface CartItem {
	barcode: string;
	category: string;
	productName: string;
	image: string;
	quantity: number;
	reason: string;
	status: string;
}

interface ShoppingItem {
	barcode: string;
	category: string;
	productName: string;
	image: string;
	quantity: number;
	cartItem: CartItem;
}
