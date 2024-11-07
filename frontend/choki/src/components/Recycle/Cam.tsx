import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

const Cam = () => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [capturedImage, setCapturedImage] = useState<string | null>(null);

	useEffect(() => {
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
			}
		}
	};

	return (
		<div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg transform transition-transform mx-auto w-[80%] max-w-lg">
			{/* 카메라 미리보기 */}
			<div className="mb-4">
				<video
					ref={videoRef}
					autoPlay
					className="rounded-md shadow-md w-70 h-80 bg-gray-200"
				/>
			</div>

			{/* 촬영 버튼 */}
			<div onClick={captureImage} className="cursor-pointer mt-2">
				<Image
					src="/icons/camera_icon.svg"
					alt="Capture Image"
					width={50}
					height={50}
					className="hover:scale-110 transition-transform"
				/>
			</div>

			{/* 찍힌 이미지 전시 */}
			{capturedImage && (
				<div className="mt-4">
					<h3 className="text-center text-lg font-bold mb-2">촬영된 사진</h3>
					<Image
						src={capturedImage}
						alt="Captured"
						className="rounded-md shadow-md"
					/>
				</div>
			)}
		</div>
	);
};

export default Cam;
