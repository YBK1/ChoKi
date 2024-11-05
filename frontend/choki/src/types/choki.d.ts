type ButtonSize = 'small' | 'medium' | 'large' | 'small_mid' | 'call_large';
type ButtonColor = 'orange' | 'white' | 'blue' | 'gray' | 'red' | 'white_call';
type ModalSize = 'small' | 'medium' | 'large';
type InputType = 'text' | 'password';
// 목적지 검색 input
type DestinationSearchProps = {
	map: any;
};

// 카카오맵 종합 props
type MapProps = {
	showRouteRecorder?: boolean;
	showPolyline?: boolean;
	showDestinationSearch?: boolean;
};

// 카카오맵 실제 지도 props
type MapContainerProps = {
	onMapLoad: (map: any) => void;
};

// 카카오맵 위에 선 그리는 props
type RoutePolylineProps = {
	map: any;
	finalRoute: { latitude: number; longitude: number }[];
	setPolyline: (polyline: any) => void;
	polyline: any;
};

// 카카오맵 경로 기록하는 props
type RouteRecorderProps = {
	setFinalRoute: (route: { latitude: number; longitude: number }[]) => void;
};

// 카카오맵 유저 표시 props
type UserLocationMarkerProps = {
	map: any;
};

// 버튼 Props
interface ButtonProps {
	size: ButtonSize;
	color: ButtonColor;
	onClick?: () => void;
	text?: string;
}

//인풋창 Props
interface InputProps {
	type: InputType;
	placeholder: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// 모달 Props
interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	size: ModalSize;
	children: React.ReactNode;
}
// 초대코드 모달 Props
interface InviteCodeModalProps {
	children: React.ReactNode;
}
// 회원 가입시 비밀번호 통합 관리
interface PasswordForm {
	password: string;
	passwordConfirm: string;
	isMatch: boolean;
	message: string;
}

// 현재 위치로 이동하는 버튼
interface CenterButtonProps {
	map: mapboxgl.Map | null;
}

// 우주 -> 일반 지도 시점 변화 버튼
interface TransitionToLocalViewProps {
	map: mapboxgl.Map | null;
	userLocation: [number, number] | null;
	setIsGlobeView: (value: boolean) => void;
}
