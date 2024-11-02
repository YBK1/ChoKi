type ButtonSize = 'small' | 'medium' | 'large' | 'small_mid' | 'call_large';
type ButtonColor = 'orange' | 'white' | 'blue' | 'gray' | 'red' | 'white_call';
// 버튼 Props
interface ButtonProps {
	size: ButtonSize;
	color: ButtonColor;
	text?: string;
}

//인풋창 Props
interface InputProps {
	placeholder: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
