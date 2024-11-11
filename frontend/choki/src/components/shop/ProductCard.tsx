import React from 'react';
import Image from 'next/image';
import WasteBasket from '@/assets/icons/waste_basket.svg';
import MiniWarning from '@/assets/icons/mini_warning.svg';

const ProductCard: React.FC<ShoppingCardProps> = ({
	role,
	ParentsShoppingItem,
	ChildrenShoppingItem,
	onCameraClick, // onCameraClick 추가
}) => {
	const onClickCamera = () => {
		onCameraClick(); // onCameraClick 호출
	};

	return (
		<div className="relative flex items-stretch px-8 py-4 border border-gray-200 rounded-2xl max-w-xl mx-auto shadow-md">
			{/* Divider */}
			<div className="absolute top-4 bottom-4 left-1/2 transform -translate-x-1/2 w-px bg-gray-200"></div>

			{/* Left Section (부모 아이템) */}
			<div className="flex flex-col items-center w-1/2 pr-6 h-full justify-center">
				<div className="w-20 h-20 mb-0 flex items-center justify-center">
					<Image
						src={ParentsShoppingItem.image || '/icons/default_image.svg'}
						alt="상품 이미지"
						layout="fixed"
						width={64}
						height={96}
					/>
				</div>
				<p className="text-gray-900 font-medium text-lg">
					{ParentsShoppingItem.title}
				</p>
				<p className="text-gray-500 text-sm">
					수량:{' '}
					<span className="font-semibold">{ParentsShoppingItem.count}개</span>
				</p>
			</div>

			{/* Right Section (자녀 아이템) */}
			<div className="flex flex-col items-center w-1/2 pl-6 h-full justify-center relative">
				{/* WasteBasket 아이콘 (CHILD) 또는 MiniWarning 아이콘 (PARENTS) */}
				{role === 'CHILD' && ChildrenShoppingItem && (
					<div className="absolute top-1 -right-4 cursor-pointer">
						<Image
							src={WasteBasket}
							alt="삭제 아이콘"
							width={20}
							height={20}
							onClick={() => console.log('삭제 아이콘 클릭')}
						/>
					</div>
				)}
				{role === 'PARENTS' && (
					<div className="absolute top-1 -right-4 transform -translate-y-1/4 cursor-pointer">
						<Image
							src={MiniWarning}
							alt="경고 아이콘"
							width={30}
							height={30}
							onClick={() => console.log('경고 아이콘 클릭')}
						/>
					</div>
				)}

				{/* CHILD일 때 상품이 없을 경우 카메라 아이콘 표시 */}
				{role === 'CHILD' && !ChildrenShoppingItem ? (
					<div className="w-12 h-12 mb-2 flex items-center justify-center">
						<Image
							src="/icons/camera_icon.svg"
							alt="카메라 아이콘"
							layout="fixed"
							width={48}
							height={48}
							onClick={onClickCamera} // 카메라 아이콘 클릭 시 onCameraClick 호출
						/>
					</div>
				) : (
					// 자녀 아이템 정보 표시
					<>
						<div className="w-20 h-20 mb-0 flex items-center justify-center">
							<Image
								src={ChildrenShoppingItem?.image || '/icons/default_image.svg'}
								alt="상품 이미지"
								layout="fixed"
								width={64}
								height={96}
							/>
						</div>
						<p className="text-gray-900 font-medium text-lg">
							{ChildrenShoppingItem?.title}
						</p>
						<p className="text-gray-500 text-sm">
							수량:{' '}
							<span className="font-semibold">
								{ChildrenShoppingItem?.count}개
							</span>
						</p>
					</>
				)}
			</div>
		</div>
	);
};

export default ProductCard;
