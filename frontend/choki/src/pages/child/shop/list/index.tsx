import Modal from '@/components/Common/Modal/nonCloseModal';
import Navbar from '@/components/Common/Navbar/UpperNavbar';
export default function childShoppingPage() {
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
			<div>
				<Modal>123</Modal>
			</div>
		</div>
	);
}
