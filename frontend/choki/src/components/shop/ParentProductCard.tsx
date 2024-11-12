import React from 'react';
import Image from 'next/image';
import MiniWarning from '@/assets/icons/mini_warning.svg';

const ParentProductCard: React.FC<ParentShoppingCardProps> = ({
	ParentsShoppingItem,
	ChildrenShoppingItem,
	showWarning,
	emptyMessage,
}) => {
	return (
		<div className="relative flex items-stretch px-8 py-4 border bg-white border-gray-200 rounded-2xl max-w-xl mx-auto shadow-md">
			<div className="absolute top-4 bottom-4 left-1/2 transform -translate-x-1/2 w-px bg-gray-200"></div>

			{/* Left Section (부모 아이템) */}
			<div className="flex flex-col items-center w-1/2 pr-6 h-full justify-center">
				{ParentsShoppingItem.productName ? (
					<>
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
							{ParentsShoppingItem.productName}
						</p>
						<p className="text-gray-500 text-sm">
							수량:{' '}
							<span className="font-semibold">
								{ParentsShoppingItem.quantity}개
							</span>
						</p>
					</>
				) : (
					<p className="text-gray-500">{emptyMessage}</p>
				)}
			</div>

			{/* Right Section (자녀 아이템) */}
			<div className="flex flex-col items-center w-1/2 pl-6 h-full justify-center relative">
				{showWarning && (
					<div className="absolute top-1 -right-4 transform -translate-y-1/4 cursor-pointer">
						<Image src={MiniWarning} alt="경고 아이콘" width={30} height={30} />
					</div>
				)}

				{ChildrenShoppingItem ? (
					<>
						<div className="w-20 h-20 mb-0 flex items-center justify-center">
							<Image
								src={ChildrenShoppingItem.image || '/icons/default_image.svg'}
								alt="상품 이미지"
								layout="fixed"
								width={64}
								height={96}
							/>
						</div>
						<p className="text-gray-900 font-medium text-lg">
							{ChildrenShoppingItem.productName}
						</p>
						<p className="text-gray-500 text-sm">
							수량:{' '}
							<span className="font-semibold">
								{ChildrenShoppingItem.quantity}개
							</span>
						</p>
					</>
				) : (
					<p className="text-gray-500">{emptyMessage}</p>
				)}
			</div>
		</div>
	);
};

export default ParentProductCard;
