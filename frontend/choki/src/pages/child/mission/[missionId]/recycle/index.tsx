import ChildNavbar from '@/components/Common/Navbar/ChildNavBar';
import AnimalSpeech from '@/components/Recycle/AnimalSpeech';
import Cam from '@/components/Recycle/Cam';
import Button from '@/components/Common/Button';
import { useState } from 'react';

const RecyclePage = () => {
	const [isImageCaptured, setIsImageCaptured] = useState<boolean>(false);
	const [classifyResult, setClassifyResult] = useState<RecycleResponse>();

	const handleComplete = () => {
		console.log('엄마 분리수거 끝내써');
	};

	const handleCaptureChange = (captured: boolean) => {
		setIsImageCaptured(captured);
	};
	return (
		<div
			className="min-h-screen bg-cover bg-center flex flex-col items-center pt-5 pb-20 px-4 sm:px-8"
			style={{
				backgroundImage: "url('/icons/recycle_background.svg')",
			}}
		>
			{/* Animal Speech Bubble */}
			<div className="-mt-6 md:mt-0">
				<AnimalSpeech isImageCaptured={classifyResult} />
			</div>

			{/* Camera Capture Component */}
			<div className="mt-3 mb-8 w-full max-w-md">
				<Cam onCaptureChange={setClassifyResult} />
			</div>

			{/* Complete Button */}
			<div className="flex justify-center">
				<Button
					size="small"
					color="orange"
					onClick={handleComplete}
					text="완료"
				/>
			</div>

			{/* Bottom Navbar */}
			<div className="fixed bottom-0 w-full">
				<ChildNavbar />
			</div>
		</div>
	);
};

export default RecyclePage;
