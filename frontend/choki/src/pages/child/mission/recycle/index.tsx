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
			style={{
				backgroundImage: "url('/icons/recycle_background.svg')",
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				minHeight: '100vh',
				flexDirection: 'column',
				justifyContent: 'space-between',
				alignItems: 'center',
				paddingTop: '20px', // Adjust this value as needed to move components upwards
				paddingBottom: '20px', // Adjust as needed for spacing at the bottom
			}}
		>
			{/* Move AnimalSpeech Up */}
			<div className="mb-6" style={{ marginTop: '-30px' }}>
				<AnimalSpeech />
			</div>

			{/* Move Camera Capture Component Up */}
			<div className="mt-6" style={{ marginTop: '10px' }}>
				<Cam />
			</div>

			<div className="mt-6 flex justify-center">
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
