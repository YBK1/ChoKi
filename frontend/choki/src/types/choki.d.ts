type ButtonSize = 'small' | 'medium' | 'large';
type ButtonColor = 'orange' | 'white' | 'blue';
// 버튼 스타일
interface ButtonProps {
	size: ButtonSize;
	color: ButtonColor;
	text?: string;
}
