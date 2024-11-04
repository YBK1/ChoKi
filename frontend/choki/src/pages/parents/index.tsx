import Image from 'next/image';
import dog_character from '@/assets/icons/dog_character.svg';
import code_information from '@/assets/icons/cod-information.svg';
import child_profile from '@/assets/icons/child_profile.svg';
import map_icon_blurry from '@/assets/icons/map_icon_blurry.svg';
import Link from 'next/link';

export default function index() {
	return (
		<div className="flex flex-col w-full max-w-md mx-auto bg-light_yellow background min-h-screen">
			{/* 안내 */}
			<div className="relative w-full h-[180px] rounded-b-3xl bg-light_yellow_dark shadow-xl">
				<h1 className="text-xl font-normal mt-10 ml-8">
					안녕하세요 민주님,
					<br />
					오늘도 아이들과 함께 파이팅!
				</h1>
				<Image
					src={dog_character}
					alt="dog_character"
					className="absolute right-4 top-4 px-1 translate-y-1/2"
				/>
				<div className="absolute top-10 right-2">
					<Image src={code_information} alt="code_information" />
				</div>
			</div>

			{/* 내용 */}
			<div className="flex flex-col justify-center items-center gap-4 mt-11">
				{/* 아이 선택 */}
				<div className="w-[350px] h-[270px] bg-white rounded-3xl shadow-sm border-4 border-light_yellow_side mb-2">
					<h2 className="text-lg font-bold mt-8 ml-7 mb-4">
						오늘은 어떤 아이에게
						<br />
						미션을 부여하실건가요?
					</h2>
					<div className="flex justify-center gap-16">
						<div className="flex flex-col items-center">
							<Image src={child_profile} alt="child_profile" />
							<p className="text-sm mt-2">여준이는 심부름왕</p>
							<p className="text-sm font-bold mt-1">Lv.10</p>
						</div>
						<div className="flex flex-col items-center">
							<Image src={child_profile} alt="child_profile" />
							<p className="text-sm mt-2">장덕동 심부름왕</p>
							<p className="text-sm font-bold mt-1">Lv.5</p>
						</div>
					</div>
				</div>

				{/* 경로 등록하기 */}
				<Link href="parents/route/create">
					<div className="relative w-[350px] h-[180px] bg-white p-6 rounded-3xl shadow-sm border-4 border-light_blue_side">
						<h2 className="text-xl font-bold mb-2 mt-4 relative z-10">
							경로 등록하기
						</h2>
						<p className="text-md text-gray-600 relative z-10">
							아이에게 심부름을 시킬
							<br />
							경로를 미리 등록해주세요!
						</p>
						<div className="absolute right-0 bottom-0">
							<Image
								src={map_icon_blurry}
								alt="map_icon_blurry"
								className="opacity-50" // 선택적: 배경이미지처럼 보이도록 투명도 추가
							/>
						</div>
					</div>
				</Link>
			</div>
		</div>
	);
}
