import Image from 'next/image';
import home_nav from '@/assets/icons/home_nav.svg';
import gallery_nav from '@/assets/icons/gallery_nav.svg';

export default function Navbar() {
	return (
		<nav className="fixed bottom-10 left-1/2 transform -translate-x-1/2 w-[330px] h-[87px] bg-white rounded-2xl shadow-lg flex items-center justify-center">
			<div className="flex gap-16">
				<div className="flex flex-col items-center">
					<div className="w-16 h-16 flex items-center justify-center mt-1">
						<Image src={home_nav} alt="home_nav" width={62} height={62} />
					</div>
				</div>

				<div className="flex flex-col items-center">
					<div className="w-16 h-16 flex items-center justify-center">
						<Image src={gallery_nav} alt="gallery_nav" width={62} height={62} />
					</div>
				</div>
			</div>
		</nav>
	);
}
