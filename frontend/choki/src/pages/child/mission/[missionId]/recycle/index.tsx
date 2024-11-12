import ChildNavbar from '@/components/Common/Navbar/ChildNavBar';
import AnimalSpeech from '@/components/Recycle/AnimalSpeech';
import Cam from '@/components/Recycle/Cam';
import Button from '@/components/Common/Button';
import { useState } from 'react';
import { useRouter } from 'next/router';
import MissionCompleteModal from '@/components/Common/Modal/MissionCompleteModal';

const RecyclePage = () => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [isImageCaptured, setIsImageCaptured] = useState<boolean>(false);
	const router = useRouter();

	const { missionId } = router.query;

	const handleComplete = () => {
		setIsModalOpen(true);
		console.log('엄마 분리수거 끝내써');
	};

	const handleCaptureChange = (captured: boolean) => {
		setIsImageCaptured(captured);
	};

	const closeMissionFinishModal = () => {
		setIsModalOpen(false);
	};

	return (
		<div
			className="min-h-screen bg-cover bg-center flex flex-col items-center pt-5 pb-20 px-4 sm:px-8"
			style={{
				backgroundImage: "url('/icons/recycle_background.svg')",
			}}
		>
			{isModalOpen && missionId ? (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="relative">
						<MissionCompleteModal missionId={missionId as string} />
						<button
							onClick={closeMissionFinishModal}
							className="absolute top-2 right-2 bg-white text-black px-2 py-1 rounded-full"
						>
							X
						</button>
					</div>
				</div>
			) : (
				<>
					<div className="-mt-6 md:mt-0">
						<AnimalSpeech isImageCaptured={isImageCaptured} />
					</div>

					<div className="mt-3 mb-8 w-full max-w-md">
						<Cam onCaptureChange={handleCaptureChange} />
					</div>

					<div className="flex justify-center">
						<Button
							size="small"
							color="orange"
							onClick={handleComplete}
							text="완료"
						/>
					</div>
				</>
			)}

			<div className="fixed bottom-0 w-full">
				<ChildNavbar />
			</div>
		</div>
	);
};

export default RecyclePage;
