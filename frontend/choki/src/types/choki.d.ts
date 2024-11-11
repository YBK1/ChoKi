type ButtonSize = 'small' | 'medium' | 'large' | 'small_mid' | 'call_large';
type ButtonColor = 'orange' | 'white' | 'blue' | 'gray' | 'red' | 'white_call';
type ModalSize = 'small' | 'medium' | 'large';
type InputType = 'text' | 'password';
// 목적지 검색 input
type DestinationSearchProps = {
	map: KakaoMap | null;
};

// 카카오맵 종합 props
type MapProps = {
	showRouteRecorder?: boolean;
	showPolyline?: boolean;
	showDestinationSearch?: boolean;
	showPreviousButton?: boolean;
	showChildNavBar: boolean;
	route?: LatLng[];
};

// 카카오맵 실제 지도 props
type MapContainerProps = {
	onMapLoad: (map: any) => void;
};

// 카카오맵 위에 선 그리는 props
type LatLng = {
	latitude: number;
	longitude: number;
};

// Define a type for the RoutePolyline component props
interface RoutePolylineProps {
	map: kakao.maps.Map | null;
	route: LatLng[];
	polyline: kakao.maps.Polyline | null;
	setPolyline: React.Dispatch<React.SetStateAction<kakao.maps.Polyline | null>>;
}

// 카카오맵 경로 기록하는 props
type RouteRecorderProps = {
	map: any;
	setFinalRoute: (route: { latitude: number; longitude: number }[]) => void;
	onRecordingFinish: () => void;
	isRecording: boolean;
	setIsRecording: (isRecording: boolean) => void;
};

// 카카오맵 유저 표시 props
type UserLocationMarkerProps = {
	map: any;
};
type MissionType = 'SHOP' | 'RECYCLE' | 'EXTRA_MISSION';
type KakaoMaps = {
	load: () => void;
	services: {
		Geocoder: {
			new (): {
				addressSearch: (
					address: string,
					callback: (
						result: Array<{
							x: string;
							y: string;
						}>,
						status: string,
					) => void,
				) => void;
			};
		};
		Status: {
			OK: string;
			ZERO_RESULT: string;
			ERROR: string;
		};
	};
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

interface nonCloseModalProps {
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

// pendingData
interface UserProfile {
	address: string;
	animals: number[]; // 각 동물의 ID를 저장하는 배열
	exp: number;
	familyId: number;
	inviteCode: string;
	isLevelUp: boolean;
	level: number;
	mainAnimalId: number;
	name: string;
	nickname: string;
	role: 'CHILD' | 'PARENT'; // 가능한 값이 'CHILD' 또는 'PARENT'일 경우 Union Type으로 정의
	tel: string;
	userId: number;
}
