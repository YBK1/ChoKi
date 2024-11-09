import Modal from '@/components/Common/Modal/nonCloseModalLarge';
import Navbar from '@/components/Common/Navbar/UpperNavbar';
import ProductCard from '@/components/shop/ProductCard';
import Image from 'next/image';
import ShoppingCharceter from '@/assets/icons/shopping_character.svg';
import SpeechBubble from '@/components/shop/SpeechBubble';

export default function childShoppingPage() {
	const dumpItem = {
		title: '상품명',
		count: 3,
	};

	return (
		<div
			className="relative flex flex-col items-center min-h-screen bg-cover bg-center"
			style={{
				backgroundImage: `url('/icons/mart_background.svg')`, // public 폴더 내 경로를 직접 지정
			}}
		>
			<div className="mt-8">
				<Navbar />
			</div>
			<div className="flex flex-col items-center">
				<Modal>
					<div className="flex flex-col items-center">
						<h1 className="text-2xl font-bold mb-6">장바구니</h1>
						<ProductCard
							role="CHILD"
							ParentsShoppingItem={dumpItem}
							ChildrenShoppingItem={dumpItem}
						/>
					</div>
				</Modal>
			</div>

			{/* 말풍선 컴포넌트 사용 */}
			<div className="absolute bottom-24 right-32">
				<SpeechBubble speech="바코드가 보이게 찍어줘! " />
			</div>

			{/* 캥거루 캐릭터 이미지 */}
			<Image
				src={ShoppingCharceter}
				alt="장보기 캐릭터"
				className="absolute bottom-16 right-4" // 오른쪽 하단에 위치시키기 위한 스타일
				width={100} // 캐릭터 이미지 크기 조절
				height={100}
			/>
		</div>
	);
}
