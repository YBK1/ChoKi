import BottomNavbar from '@/components/Common/Navbar/BottomNavbar';
import Image from 'next/image';
import { useRouter } from 'next/router';
export default function Index() {
	const router = useRouter();
	const handleGoBack = () => {
		router.back();
	};
	return (
		<>
			<div className="flex flex-col w-full max-w-md mx-auto bg-light_yellow min-h-screen pb-24">
				<div className="flex m-5 items-center gap-24 mt-8">
					<Image
						src="/icons/previous_nav.svg"
						alt="previous_icon"
						className="w-10 h-10 cursor-pointer rounded-2xl shadow-xl mr-2"
						onClick={handleGoBack}
						width={48}
						height={48}
					/>
					<div className="font-bold text-xl">미션 기록</div>
				</div>
				<BottomNavbar />
			</div>
		</>
	);
}
