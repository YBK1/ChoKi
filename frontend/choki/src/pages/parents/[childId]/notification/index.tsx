import Image from 'next/image';
import { useRouter } from 'next/router';
import previous_icon from '@/assets/icons/previous.svg';

export default function NotificationPage() {
	const router = useRouter();

	const handleGoBack = () => {
		router.back();
	};

	return (
		<>
			<div className="flex flex-col w-full max-w-md mx-auto bg-light_yellow background min-h-screen">
				<Image
					src={previous_icon}
					alt="previous_icon"
					className="w-12 h-12 m-4 cursor-pointer" // cursor-pointer 추가
					onClick={handleGoBack}
				/>
			</div>
		</>
	);
}
