type ButtonSize = 'small' | 'medium' | 'large' | 'small_mid';
type ButtonColor = 'orange' | 'white' | 'blue' | 'gray';
// 버튼 스타일
interface ButtonProps {
	size: ButtonSize;
	color: ButtonColor;
	text?: string;
}
