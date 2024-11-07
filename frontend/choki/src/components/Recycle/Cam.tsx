import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Button from '../Common/Button';

const Cam: React.FC<CamProps> = ({ onCaptureChange }) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [capturedImage, setCapturedImage] = useState<string | null>(null);

	const startCamera = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: true,
			});
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
			}
		} catch (error) {
			console.error('카메라 권한 요청 실패:', error);
		}
	};

	useEffect(() => {
		startCamera();

		const currentVideoRef = videoRef.current;

		return () => {
			if (currentVideoRef && currentVideoRef.srcObject) {
				(currentVideoRef.srcObject as MediaStream)
					.getTracks()
					.forEach(track => track.stop());
			}
		};
	}, []);

	const captureImage = () => {
		if (videoRef.current) {
			const canvas = document.createElement('canvas');
			canvas.width = videoRef.current.videoWidth;
			canvas.height = videoRef.current.videoHeight;
			const ctx = canvas.getContext('2d');
			if (ctx) {
				ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
				const imageDataUrl = canvas.toDataURL('image/png');
				setCapturedImage(imageDataUrl);
				onCaptureChange(true);
			}
		}
	};

	const handleRetake = () => {
		setCapturedImage(null);
		startCamera();
		onCaptureChange(false);
	};

	return (
		<div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg transform transition-transform mx-auto w-[80%] max-w-lg">
			{/* 카메라 화면 or 찍은 사진 */}
			<div className="mb-4 w-full flex justify-center">
				{capturedImage ? (
					<Image
						src={capturedImage}
						alt="Captured"
						width={320}
						height={240}
						className="rounded-md shadow-md"
					/>
				) : (
					<video
						ref={videoRef}
						autoPlay
						className="rounded-md shadow-md w-auto h-80 bg-gray-200"
					/>
				)}
			</div>

			{/* Capture Button */}
			{capturedImage ? (
				<div className="flex gap-4 mt-4">
					<Button
						size="small"
						color="blue"
						onClick={handleRetake}
						text="알겠어!"
					/>
				</div>
			) : (
				<div onClick={captureImage} className="cursor-pointer mt-2">
					<Image
						src="/icons/camera_icon.svg"
						alt="Capture Image"
						width={50}
						height={50}
						className="hover:scale-110 transition-transform"
					/>
				</div>
			)}
		</div>
	);
};
export default Cam;
