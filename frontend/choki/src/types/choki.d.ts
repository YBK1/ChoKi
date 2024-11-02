type ButtonSize = 'small' | 'medium' | 'large' | 'small_mid' | 'call_large';
type ButtonColor = 'orange' | 'white' | 'blue' | 'gray' | 'red' | 'white_call';
// 버튼 스타일
interface ButtonProps {
	size: ButtonSize;
	color: ButtonColor;
	text?: string;
}
