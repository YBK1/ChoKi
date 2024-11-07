import BottomNavbar from '@/components/Common/Navbar/BottomNavbar';
import AnimalSpeech from '@/components/Recycle/AnimalSpeech';
import Cam from '@/components/Recycle/Cam';
import Button from '@/components/Common/Button';

const RecyclePage = () => {
	const handleComplete = () => {
		console.log('엄마 분리수거 끝내써');
	};

	return (
		<div
			className="min-h-screen bg-cover bg-center flex flex-col items-center justify-between pt-5 pb-20 px-4 sm:px-8"
			style={{
				backgroundImage: "url('/icons/recycle_background.svg')",
			}}
		>
			{/* Animal Speech Bubble */}
			<div className="mb-8 -mt-6 md:mt-0">
				<AnimalSpeech />
			</div>

			{/* Camera Capture Component */}
			<div className="mb-8 w-full max-w-md">
				<Cam />
			</div>

			{/* Complete Button */}
			<div className="flex justify-center mt-[-40px] mb-8">
				<Button
					size="small"
					color="orange"
					onClick={handleComplete}
					text="완료"
				/>
			</div>

			{/* Bottom Navbar */}
			<div className="fixed bottom-0 w-full">
				<BottomNavbar />
			</div>
		</div>
	);
};

export default RecyclePage;
