import React from 'react';
import Image from 'next/image';
import dog_character from '@/assets/icons/dog_character.svg';

const AnimalSpeech = () => {
	return (
		<div className="flex justify-center w-full p-2 mt-10">
			{/* Speech Balloon */}
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
				{/* Speech text */}
				헷갈리는 쓰레기는 사진을 찍어봐!
			</div>

			{/* Animal Image */}
			<div>
				<Image src={dog_character} alt="강아지 캐릭터" />
			</div>
		</div>
	);
};

export default AnimalSpeech;
