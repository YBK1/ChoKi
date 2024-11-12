// child/shop으로 시작하는 페이지에 들어가는 Navbar
import Image from 'next/image';
import Link from 'next/link';

export default function UpperNavbar() {
	return (
		<>
			<nav className="fixed top-5 z-100 w-full left-[50%] transform -translate-x-1/2">
				{' '}
				<div className="h-full flex justify-center items-center gap-5">
					{/* 나가기 버튼 */}
					<Link href="/child/main">
						<div className="flex mt-2">
							<Image src="/icons/back_icon_kid_yellow.svg" alt="back_icon" />
						</div>
					</Link>

					{/* 경로 및 장바구니 버튼 */}
					<div className="w-[190px] h-[60px] bg-light_yellow_nav rounded-full flex justify-center items-center shadow-lg">
						<Link href="/child/shop/route">
							<button className="p-2">
								<Image src="/icons/map.svg" alt="map_icon" />
							</button>
						</Link>

						<div className="w-px h-8 bg-light_yellow_nav mx-2" />

						<Link href="/child/shop/list">
							<button className="p-2">
								<Image src="/icons/basket.svg" alt="basket_icon" />
							</button>
						</Link>
					</div>
				</div>
			</nav>
		</>
	);
}
