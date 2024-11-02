// child/shop으로 시작하는 페이지에 들어가는 Navbar
import back_icon_kid_white from '@/assets/icons/back_icon_kid_white.svg';
import map from '@/assets/icons/map.svg';
import basket from '@/assets/icons/basket.svg';
import Image from 'next/image';

export default function Upper() {
	return (
		<>
			<nav className="fixed top-5 z-50 w-full flex ml-10">
				<div className="h-full flex justify-center items-center gap-5">
					{/* 나가기 버튼 */}
					<div className="flex mt-2">
						<Image src={back_icon_kid_white} alt="back_icon" />
					</div>

					{/* 경로 및 장바구니 버튼 */}
					<div className="w-[190px] h-[60px] bg-white rounded-full flex justify-center items-center shadow-lg">
						<button className="">
							<Image src={map} alt="map_icon" />
						</button>

						<div className="w-px h-8 bg-gray-200 mx-2" />

						<button className="">
							<Image src={basket} alt="basket_icon" />
						</button>
					</div>
				</div>
			</nav>
		</>
	);
}
