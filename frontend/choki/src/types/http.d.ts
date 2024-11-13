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
interface SearchCartItem extends ItemSearchResponse {
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

interface userDataResponse {
	userId: number;
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
// 쇼핑 아이템의 구조
interface CartItem {
	barcode: string;
	category: string;
	productName: string;
	image: string;
	quantity: number;
	reason?: string;
	status?: string;
}
// ProductCard에서 사용하는 Props
interface ShoppingCardProps {
	role: 'CHILD' | 'PARENTS';
	ParentsShoppingItem: {
		title: string;
		count: number;
		image: string;
	};
	ChildrenShoppingItem?: {
		title: string;
		count: number;
		image: string;
	};
	onCameraClick: () => void; // 카메라 클릭 핸들러 추가
}

interface ParentShoppingCardProps {
	ParentsShoppingItem: {
		productName: string;
		quantity: number;
		image: string;
	};
	ChildrenShoppingItem?: {
		productName: string;
		quantity: number;
		image: string;
	};
	status?: 'MATCH' | 'NOT_MATCH' | 'SIMILAR';
	reason?: 'SOLD_OUT' | 'NO_REASON' | 'BLANK';
	showWarning?: boolean;
	emptyMessage?: string;
}
interface ShoppingItem {
	barcode: string;
	category: string;
	productName: string;
	image: string;
	quantity: number;
	cartItem?: {
		barcode: string;
		category: string;
		productName: string;
		quantity: number;
		image: string;
		reason?: 'SOLD_OUT' | 'NO_REASON' | 'BLANK';
		status?: string;
	};
}

interface UnityMainResponse {
	userId: number;
	nickname: string;
	level: number;
	exp: number;
	isLevelUp: number; // Unity expects 0 or 1
	mainAnimalId: number;
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

interface CompareItemsRequest {
	originBarcode: string;
	inputBarcode: string;
}

interface ShoppingListResponse {
	status: number;
	matchStatus: string;
	message: string;
}
