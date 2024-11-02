import Image from 'next/image';
import dog_character from '@/assets/icons/dog_character.svg';
import code_information from '@/assets/icons/cod-information.svg';

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
		</div>
	);
}
