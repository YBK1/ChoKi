import React from 'react';
import Image from 'next/image';

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
					padding: '30px 40px',
					maxWidth: '200px',
					fontSize: '16px',
				}}
			>
				{/* Speech text */}
				헷갈리는 쓰레기는 사진을 찍어봐!
			</div>

			{/* Animal Image */}
			<div>
				<Image
					src="/choki192x192.png"
					alt="Animal"
					width={100}
					height={100}
					className="rounded-full"
				/>
			</div>
		</div>
	);
};

export default AnimalSpeech;
