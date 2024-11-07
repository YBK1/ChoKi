import React from 'react';
import Image from 'next/image';

const ProductCard: React.FC<ShoppingCardProps> = ({
	role,
	ParentsShoppingItem,
	ChildrenShoppingItem,
}) => {
	return (
		<div className="relative flex items-center p-4 border border-gray-200 rounded-2xl max-w-md mx-auto shadow-sm">
			{/* Divider */}
			<div className="absolute top-3 bottom-3 left-1/2 transform -translate-x-1/2 w-px bg-gray-200"></div>

			{/* Left Section */}
			<div className="flex flex-col items-center w-1/2 pr-4 h-full justify-center">
				<div className="w-16 mb-1 flex items-center justify-center">
					<Image
						src="/icons/test_item.svg"
						alt="상품 이미지"
						layout="responsive"
						width={1}
						height={1.5}
					/>
				</div>
				<p className="text-gray-900 font-medium text-base">
					{ParentsShoppingItem.title}
				</p>
				<p className="text-gray-500 text-xs">
					수량:{' '}
					<span className="font-semibold">{ParentsShoppingItem.count}</span>
				</p>
			</div>

			{/* Right Section: 역할과 ChildrenShoppingItem 존재 여부에 따라 렌더링 */}
			{role === 'CHILD' ? (
				!ChildrenShoppingItem ? (
					<div className="flex flex-col items-center w-1/2 pl-4 h-full justify-center">
						<div className="w-12 mb-2 flex items-center justify-center">
							<Image
								src="/icons/carmera_icon.svg"
								alt="카메라 아이콘"
								layout="responsive"
								width={1}
								height={1}
							/>
						</div>
						<p className="text-gray-400 text-center text-sm">
							담고 싶은 상품을 찍어보세요!
						</p>
					</div>
				) : (
					<div className="flex flex-col items-center w-1/2 pl-4 h-full justify-center">
						{/*TODO - 이미지 S3 주소로 대체 예정 */}
						<Image
							src="/icons/test_item.svg"
							alt="상품 이미지"
							layout="responsive"
							width={1}
							height={1.5}
						/>
						{/* CHILD일 때 상품이 존재하는 경우 */}
						<p className="text-gray-900 font-medium text-base">
							{ChildrenShoppingItem.title}
						</p>
						<p className="text-gray-500 text-xs">
							수량:{' '}
							<span className="font-semibold">
								{ChildrenShoppingItem.count}개
							</span>
						</p>
					</div>
				)
			) : role === 'PARENTS' ? (
				!ChildrenShoppingItem ? (
					<div className="flex flex-col items-center w-1/2 pl-4 h-full justify-center">
						{/* PARENTS일 때 아직 상품을 담지 않은 경우 */}
						<p className="text-gray-900 font-medium text-base">
							상품을 아직 담지 않았어요
						</p>
					</div>
				) : (
					<div className="flex flex-col items-center w-1/2 pl-4 h-full justify-center">
						<Image
							src="/icons/test_item.svg"
							alt="상품 이미지"
							layout="responsive"
							width={1}
							height={1.5}
						/>
						{/* PARENTS일 때 상품이 존재하는 경우 */}
						<p className="text-gray-900 font-medium text-base">
							{ChildrenShoppingItem.title}
						</p>
						<p className="text-gray-500 text-xs">
							수량:{' '}
							<span className="font-semibold">
								{ChildrenShoppingItem.count}개
							</span>
						</p>
					</div>
				)
			) : null}
		</div>
	);
};

export default ProductCard;
