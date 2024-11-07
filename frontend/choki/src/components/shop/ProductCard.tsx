import React from 'react';
import Image from 'next/image';

const ProductCard: React.FC = () => {
	return (
		<div className="relative flex items-center p-4 border border-gray-200 rounded-2xl max-w-md mx-auto shadow-sm">
			{/* Divider */}
			<div className="absolute top-3 bottom-3 left-1/2 transform -translate-x-1/2 w-px bg-gray-200"></div>{' '}
			{/* 중앙에 고정된 선, 위아래 여백 추가 */}
			{/* Left Section */}
			<div className="flex flex-col items-center w-1/2 pr-4 h-full justify-center">
				<div className="w-16 mb-1 flex items-center justify-center">
					{' '}
					{/* 이미지 컨테이너 간격 조정 */}
					<Image
						src="/icons/test_item.svg" // 우유 이미지 파일을 public 폴더에 넣어주세요
						alt="새우깡"
						layout="responsive"
						width={1} // 비율 기준을 위해 width를 1로 설정
						height={1.5} // 비율 기준을 위해 height를 1.5로 설정 (64:96 비율)
					/>
				</div>
				<p className="text-gray-900 font-medium text-base">새우깡</p>{' '}
				{/* 상품명 아래 간격 조정 */}
				<p className="text-gray-500 text-xs">
					수량: <span className="font-semibold">1개</span>
				</p>
			</div>
			{/* Right Section */}
			<div className="flex flex-col items-center w-1/2 pl-4 h-full justify-center">
				<div className="w-12 mb-2 flex items-center justify-center">
					<Image
						src="/icons/carmera_icon.svg" // 카메라 아이콘 파일을 public 폴더에 넣어주세요
						alt="카메라 아이콘"
						layout="responsive"
						width={1} // 비율 기준을 위해 width를 1로 설정
						height={1} // 정사각형 비율
					/>
				</div>
				<p className="text-gray-400 text-center text-sm">
					담고 싶은 상품을 찍어보세요!
				</p>
			</div>
		</div>
	);
};

export default ProductCard;
