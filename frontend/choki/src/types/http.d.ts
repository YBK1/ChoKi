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
	missionId: string;
	time: string;
}

interface ItemSearchResponse {
	barcode: string;
	category: string;
	productName: string;
	image: string;
}
interface CartItem extends ItemSearchResponse {
	quantity: number;
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

interface ShoppingRequest {
	parentId: number;
	childId: number;
	startPoint: ShoppingLocation;
	destination: ShoppingLocation;
	route: RoutePoint[];
	shoppingList: ReturnType<typeof getShoppingList>;
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

interface KidDataResponseFromParent {
	id: string;
	username: string;
	nickname: string;
	address: string;
	name: string;
	tel: string;
	role: 'PARENT' | 'CHILD';
	level: number;
	exp: number;
	pastLevel: number;
	mainAnimal: number;
}

interface InProgressMissionResponse {
	content: string;
	completedAt: string;
	image: string;
	type: MissionType;
	shoppingId: string;
}

interface RecycleResponse {
	class: number;
	name: string;
}
