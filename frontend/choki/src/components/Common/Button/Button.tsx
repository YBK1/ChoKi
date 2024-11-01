import React from 'react';

type ButtonSize = 'small' | 'medium' | 'large';
type ButtonColor = 'orange' | 'white' | 'blue';

interface ButtonProps {
	size: ButtonSize;
	color: ButtonColor;
	text?: string;
	onClick?: () => void;
	disabled?: boolean;
}

export default function Button({
	size = 'medium',
	color = 'orange',
	text,
	onClick,
	disabled = false,
}: ButtonProps) {
	// 기본 버튼 스타일
	const baseStyle =
		'font-pretendard font-medium transition-colors duration-200';

	// 사이즈별 스타일
	const sizeStyles = {
		small: 'px-4 py-1 text-sm rounded-full',
		medium: 'w-[240px] h-[50px] text-base rounded-[15px]',
		large: 'w-[315px] h-[65px] text-lg rounded-[20px]',
	};

	// 커스텀 컬러별 스타일
	const colorStyles = {
		orange:
			'bg-orange_main text-white hover:bg-orange_main/80 disabled:bg-orange_main/50',
		white:
			'bg-white text-orange_main border border-orange_main hover:bg-light_yellow_btn disabled:border-orange_main/50 disabled:text-orange_main/50',
		blue: 'bg-light_blue_btn text-black_mission hover:bg-light_blue_btn/80 disabled:bg-light_blue_btn/50',
	};

	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className={`
        ${baseStyle}
        ${sizeStyles[size]}
        ${colorStyles[color]}
      `}
		>
			{text}
		</button>
	);
}
