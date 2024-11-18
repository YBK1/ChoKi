import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Button from '../Common/Button';
import { classifyRecycle, finishRecycle } from '@/lib/api/recycle';
import { useParams } from 'next/navigation';

const Cam: React.FC<CamProps> = ({ onCaptureChange, completeFlag }) => {
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

	const classify = async (image: File) => {
		try {
			const formData = new FormData();
			formData.append('image', image);

			const result = await classifyRecycle(formData);
			onCaptureChange(result.data);
			setCapturedImage(result.data.image.data);
		} catch (error) {
			console.error('분류 실패', error);
		}
	};

	const captureFinish = async (image: File) => {
		try {
			const params = useParams();

			const formData = new FormData();
			formData.append('data', JSON.stringify({ missionId: params.missionId }));
			formData.append('file', image);

			const result = await finishRecycle(formData);
			onCaptureChange(result.data);
		} catch (error) {
			console.error('분류 실패', error);
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

	useEffect(() => {
		setCapturedImage(null);
		startCamera();
	}, [completeFlag]);

	const captureImage = () => {
		if (videoRef.current) {
			const canvas = document.createElement('canvas');
			canvas.width = videoRef.current.videoWidth;
			canvas.height = videoRef.current.videoHeight;
			const ctx = canvas.getContext('2d');
			if (ctx) {
				ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

				canvas.toBlob(
					blob => {
						if (blob) {
							const file = new File([blob], 'captured-image.png', {
								type: 'image/png',
								lastModified: new Date().getTime(),
							});
							if (completeFlag) {
								handleRetake();
								captureFinish(file);
							} else {
								const imageDataUrl = canvas.toDataURL('image/png');
								// setCapturedImage(imageDataUrl);
								classify(file);
							}
						}
					},
					'image/png',
					0.9,
				); // 0.9는 품질 설정 (0~1)
			}
		}
	};

	const handleRetake = () => {
		setCapturedImage(null);
		startCamera();
		onCaptureChange(undefined);
	};

	return (
		<div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg transform transition-transform mx-auto w-[80%] max-w-lg">
			{/* 카메라 화면 or 찍은 사진 */}
			<div className="mb-4 w-full flex justify-center">
				<div className="bg-gray-200 rounded-md shadow-md overflow-hidden w-80 h-80 flex items-center justify-center">
					{capturedImage ? (
						<Image
							src={capturedImage}
							alt="Captured"
							width={320}
							height={240}
							className="w-full h-full object-cover"
						/>
					) : (
						<video
							ref={videoRef}
							autoPlay
							className="w-full h-full object-cover"
						/>
					)}
				</div>
			</div>

			{/* 촬영 버튼 */}
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
