type ButtonSize = 'small' | 'medium' | 'large' | 'small_mid' | 'call_large';
type ButtonColor = 'orange' | 'white' | 'blue' | 'gray' | 'red' | 'white_call';
type ModalSize = 'small' | 'medium' | 'large';
type InputType = 'text' | 'password';
type MissionType = 'SHOP' | 'RECYCLE' | 'EXTRA_MISSION';

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

// 회원 가입시 비밀번호 통합 관리
interface PasswordForm {
	password: string;
	passwordConfirm: string;
	isMatch: boolean;
	message: string;
}

// 미션 타입
interface Mission {
	type: MissionType;
	content: string;
}
