import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { uploadMissionImage } from '@/lib/api/shopping';

interface MissionFinishComponentProps {
	missionId: string;
}

const MissionCompleteModal: React.FC<MissionFinishComponentProps> = ({
	missionId,
}) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [capturedImage, setCapturedImage] = useState<File | null>(null);
	const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
	const [imageDimensions, setImageDimensions] = useState<{
		width: number;
		height: number;
	} | null>(null);
	const [isCaptured, setIsCaptured] = useState(false);

	const startCamera = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true });
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
			}
		} catch (error) {
			console.error('Error accessing the camera:', error);
		}
	};

	const captureImage = () => {
		const canvas = canvasRef.current;
		const video = videoRef.current;
		if (canvas && video) {
			const context = canvas.getContext('2d');
			if (context) {
				canvas.width = video.videoWidth;
				canvas.height = video.videoHeight;
				context.drawImage(video, 0, 0, canvas.width, canvas.height);

				canvas.toBlob(blob => {
					if (blob) {
						const file = new File([blob], 'capture.png', { type: 'image/png' });
						setCapturedImage(file);
						setImageDimensions({ width: canvas.width, height: canvas.height });
						setIsCaptured(true);
					}
				}, 'image/png');
			} else {
				console.error('Error: Unable to get 2D context from canvas');
			}
		}
	};

	const confirmAndUploadImage = () => {
		if (capturedImage) {
			uploadMissionImage(missionId, capturedImage);
			resetCapture();
		}
	};

	const resetCapture = () => {
		setIsCaptured(false);
		setCapturedImage(null);
		setImagePreviewUrl(null);
		startCamera();
	};

	useEffect(() => {
		if (capturedImage) {
			const objectUrl = URL.createObjectURL(capturedImage);
			setImagePreviewUrl(objectUrl);

			return () => URL.revokeObjectURL(objectUrl);
		}
	}, [capturedImage]);

	useEffect(() => {
		startCamera();
	}, []);

	return (
		<div className="flex flex-col items-center space-y-4 p-4 bg-white rounded-lg shadow-lg max-w-xs mx-auto">
			<div className="relative flex items-center">
				<div className="mr-4 p-2 bg-light_yellow text-sm rounded-lg shadow-md">
					<p>
						장보기를 마무리할래?
						<br />
						인증 사진을 찰칵~!
					</p>
				</div>

				<div className="w-20 h-20">
					<Image
						src="/icons/dog_character.svg"
						alt="Animal Character"
						width={80}
						height={80}
					/>
				</div>
			</div>

			{/* 캡쳐 상태에 따라 카메라 화면 or 이미지 렌더링 */}
			<div className="relative w-40 h-52 bg-gray-200 rounded-lg overflow-hidden">
				{imagePreviewUrl ? (
					<Image
						src={imagePreviewUrl}
						alt="Captured"
						width={imageDimensions?.width || 100}
						height={imageDimensions?.height || 100}
						className="object-cover w-full h-full"
					/>
				) : (
					<video
						ref={videoRef}
						autoPlay
						className="object-cover w-full h-full"
					/>
				)}
				{isCaptured ? (
					<div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
						<button
							onClick={confirmAndUploadImage}
							className="px-4 py-2 bg-green-500 text-white rounded-full"
						>
							미션 완료
						</button>
						<button
							onClick={resetCapture}
							className="px-4 py-2 bg-gray-500 text-white rounded-full"
						>
							다시 찍기
						</button>
					</div>
				) : (
					<button
						onClick={captureImage}
						className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white rounded-full border-2 border-gray-300"
					></button>
				)}
			</div>

			{/* Hidden Canvas for capturing image */}
			<canvas ref={canvasRef} className="hidden"></canvas>
		</div>
	);
};

export default MissionCompleteModal;
