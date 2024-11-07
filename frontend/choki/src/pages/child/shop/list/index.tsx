import Modal from '@/components/Common/Modal/nonCloseModal';
import Navbar from '@/components/Common/Navbar/UpperNavbar';
import ProductCard from '@/components/shop/ProductCard';
export default function childShoppingPage() {
	const dumpItem = {
		title: '상품명',
		count: 3,
	};
	return (
		<div
			className="relative flex flex-col  items-center min-h-screen bg-cover bg-center"
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
						<h1 className="text-2xl font-bold">장바구니</h1>
						<ProductCard
							role="CHILD"
							ParentsShoppingItem={dumpItem}
							ChildrenShoppingItem={dumpItem}
						/>
					</div>
				</Modal>
			</div>
		</div>
	);
}
