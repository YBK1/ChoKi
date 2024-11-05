type ButtonSize = 'small' | 'medium' | 'large' | 'small_mid' | 'call_large';
type ButtonColor = 'orange' | 'white' | 'blue' | 'gray' | 'red' | 'white_call';
type ModalSize = 'small' | 'medium' | 'large';
type InputType = 'text' | 'password';
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

interface AddressData {
	address: string;
	zonecode: string;
	latitude?: number; // 위도 추가
	longitude?: number; // 경도 추가
}

interface PostcodeResult {
	address: string;
	zonecode: string;
	// 다음(카카오)에서 제공하는 다른 주소 정보들도 필요하다면 여기에 추가
}
interface AddressSearchProps {
	onComplete: (data: AddressData) => void;
	onClose: () => void;
}
interface PostcodeOptions {
	oncomplete: (data: PostcodeResult) => void;
	onclose?: () => void;
	width: string;
	height: string;
}
interface Mission {
	type: MissionType;
	content: string;
}
