import React from 'react';
import Image from 'next/image';
import dog_character from '@/assets/icons/dog_character.svg';

const AnimalSpeech: React.FC<AnimalSpeechProps> = ({ isImageCaptured }) => {
	return (
		<div className="flex justify-center w-full p-2 mt-10">
			{/* 말풍선 */}
			<div
				style={{
					backgroundImage: "url('/icons/recycle_speech_bubble.svg')",
					backgroundSize: 'contain',
					backgroundRepeat: 'no-repeat',
					backgroundPosition: 'center',
					padding: '35px',
					paddingLeft: '26px',
					maxWidth: '200px',
					fontSize: '16px',
					fontWeight: 'bold',
				}}
			>
				{/* 텍스트 */}
				{isImageCaptured
					? '이것도 몰라? 잘 생각해봐!'
					: '헷갈리는 쓰레기는 사진을 찍어봐!'}
			</div>

			{/* 동물 */}
			<div>
				<Image src={dog_character} alt="강아지 캐릭터" />
			</div>
		</div>
	);
};

export default AnimalSpeech;
