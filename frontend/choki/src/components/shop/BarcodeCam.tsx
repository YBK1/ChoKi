import React, { useRef, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

interface CamProps {
	onCaptureChange: (isCaptured: boolean) => void;
	originBarcode: string;
}

const Cam: React.FC<CamProps> = ({ onCaptureChange, originBarcode }) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isScanning, setIsScanning] = useState(true);
	const [isSuccess, setIsSuccess] = useState(false);

	useEffect(() => {
		const startScan = async () => {
			// Mock barcode scanning process
			setTimeout(() => {
				if (originBarcode) {
					setIsScanning(false);
					setIsSuccess(true);
					triggerConfetti();
				}
			}, 3000); // Simulate a 3-second scan
		};

		startScan();
		return () => {
			videoRef.current?.pause();
		};
	}, [originBarcode]);

	const triggerConfetti = () => {
		confetti({
			particleCount: 150,
			spread: 60,
			origin: { y: 0.6 },
			colors: ['#FFC0CB', '#FFD700', '#ADD8E6'], // 파스텔 톤 색상
		});
	};

	return (
		<div className="flex flex-col items-center p-4 bg-gradient-to-b from-pink-100 to-blue-50 rounded-lg shadow-lg w-full max-w-md mx-auto">
			{/* 카메라 영역 */}
			<div className="relative w-full h-64 bg-gray-200 rounded-lg">
				<video
					ref={videoRef}
					autoPlay
					className="absolute inset-0 w-full h-full object-cover rounded-lg"
				/>
				{/* 바코드 가이드라인 */}
				<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
					<div className="relative w-48 h-24 border-4 border-dashed border-pink-400 rounded-lg animate-blink">
						<p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-pink-500 font-bold text-sm">
							여기에 바코드를 맞춰주세요!
						</p>
					</div>
				</div>
			</div>

			{/* 상태 표시 */}
			<div className="mt-4 text-center">
				{isScanning && (
					<p className="text-blue-600 text-lg font-semibold animate-pulse">
						바코드를 찾고 있어요!
					</p>
				)}
				{isSuccess && (
					<p className="text-green-600 text-lg font-bold">잘했어요! 🎉</p>
				)}
			</div>

			{/* 버튼 */}
			<div className="mt-6">
				<button
					onClick={() => onCaptureChange(false)}
					className="px-4 py-2 bg-blue-400 text-white rounded-lg shadow hover:bg-blue-500"
				>
					돌아가기
				</button>
			</div>
		</div>
	);
};

export default Cam;

<style jsx>{`
	@keyframes blink {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
		100% {
			opacity: 1;
		}
	}
	.animate-blink {
		animation: blink 1s infinite;
	}
`}</style>;
