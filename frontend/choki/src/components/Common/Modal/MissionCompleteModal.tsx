import Image from 'next/image';
import React, { useRef, useState } from 'react';

interface MissionFinishComponentProps {
	missionId: string; // Add shoppingId as a prop
}

const MissionCompleteModal: React.FC<MissionFinishComponentProps> = ({
	missionId,
}) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [capturedImage, setCapturedImage] = useState<string | null>(null);
	const [imageDimensions, setImageDimensions] = useState<{
		width: number;
		height: number;
	} | null>(null);

	// Start the camera
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

	// Capture the image from the video feed
	const captureImage = () => {
		const canvas = canvasRef.current;
		const video = videoRef.current;
		if (canvas && video) {
			const context = canvas.getContext('2d');
			if (context) {
				// Check if context is not null
				canvas.width = video.videoWidth;
				canvas.height = video.videoHeight;
				context.drawImage(video, 0, 0, canvas.width, canvas.height);

				const imageUrl = canvas.toDataURL('image/png');
				setCapturedImage(imageUrl); // Convert the image to a data URL
				setImageDimensions({ width: canvas.width, height: canvas.height });

				console.log('Captured Image URL:', imageUrl);
				console.log('Shopping ID:', missionId);
			} else {
				console.error('Error: Unable to get 2D context from canvas');
			}
		}
	};

	// Start the camera when the component mounts
	React.useEffect(() => {
		startCamera();
	}, []);

	return (
		<div className="flex flex-col items-center space-y-4 p-4 bg-white rounded-lg shadow-lg max-w-xs mx-auto">
			{/* Animal Character with Speech Bubble */}
			<div className="relative flex items-center">
				{/* Speech Bubble */}
				<div className="mr-4 p-2 bg-light_yellow text-sm rounded-lg shadow-md">
					<p>
						장보기를 마무리할래?
						<br />
						인증 사진을 찰칵~
					</p>
				</div>

				{/* Animal Image */}
				<div className="w-20 h-20">
					<Image
						src="/icons/dog_character.svg"
						alt="Animal Character"
						width={80}
						height={80}
					/>
				</div>
			</div>

			{/* Camera or Captured Image */}
			<div className="relative w-40 h-52 bg-gray-200 rounded-lg overflow-hidden">
				{capturedImage ? (
					// Display the captured image
					<Image
						src={capturedImage}
						alt="Captured"
						width={imageDimensions?.width || 100}
						height={imageDimensions?.height || 100}
						className="object-cover w-full h-full"
					/>
				) : (
					// Display the live camera feed
					<video
						ref={videoRef}
						autoPlay
						className="object-cover w-full h-full"
					/>
				)}
				{/* Circular capture button at the bottom of the frame */}
				<button
					onClick={captureImage}
					className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white rounded-full border-2 border-gray-300"
				></button>
			</div>

			{/* Hidden Canvas for capturing image */}
			<canvas ref={canvasRef} className="hidden"></canvas>
		</div>
	);
};

export default MissionCompleteModal;
