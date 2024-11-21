import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { uploadShoppingImage } from '@/lib/api/shopping';
import { useRouter } from 'next/router';

interface ShoppingFinishComponentProps {
	missionId: string;
}

const ShoppingCompleteModal: React.FC<ShoppingFinishComponentProps> = ({
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
	const [cameraError, setCameraError] = useState(false);
	const [hasPermission, setHasPermission] = useState<boolean>(false); // 권한 상태
	const [showToast, setShowToast] = useState<string | null>(null); // 토스트 메시지 상태
	const router = useRouter();

	// 권한 상태 확인 및 요청
	const checkCameraPermission = async () => {
		try {
			const permission = await navigator.permissions.query({
				name: 'camera' as PermissionName,
			});

			if (permission.state === 'denied') {
				setHasPermission(false);
				throw new Error('카메라 권한이 거부되었습니다.');
			} else {
				setHasPermission(true);
			}
		} catch (error) {
			console.error('권한 확인 실패:', error);
			setShowToast('카메라 권한을 허용해주세요.');
			setHasPermission(false);
			throw error;
		}
	};

	const startCamera = async () => {
		try {
			// 카메라 권한 확인
			await checkCameraPermission();
			if (!hasPermission) return;

			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: 'environment',
					width: { ideal: 1280 },
					height: { ideal: 720 },
				},
			});
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
			} else {
				// Clean up the stream if the video element is gone
				stream.getTracks().forEach(track => track.stop());
			}
		} catch (error) {
			console.error('카메라 접근 실패:', error);
			setCameraError(true);
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

						// Stop the camera stream after capturing
						const stream = video.srcObject as MediaStream;
						if (stream) {
							stream.getTracks().forEach(track => track.stop());
						}
					}
				}, 'image/png');
			} else {
				console.error('Error: Unable to get 2D context from canvas');
			}
		}
	};

	const confirmAndUploadImage = () => {
		if (capturedImage) {
			uploadShoppingImage(missionId, capturedImage)
				.then(() => {
					resetCapture();
					router.push('/child/main');
				})
				.catch(error => {
					console.error('이미지 업로드 실패:', error);
				});
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
		const initializeCamera = async () => {
			try {
				await startCamera();
			} catch (error) {
				console.error('카메라 초기화 실패:', error);
			}
		};

		initializeCamera();

		return () => {
			if (videoRef.current) {
				const stream = videoRef.current.srcObject as MediaStream;
				stream?.getTracks().forEach(track => track.stop());
			}
		};
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

			<div className="relative w-40 h-52 bg-gray-200 rounded-lg overflow-hidden">
				{imagePreviewUrl ? (
					<Image
						src={imagePreviewUrl}
						alt="Captured"
						width={imageDimensions?.width || 100}
						height={imageDimensions?.height || 100}
						className="object-cover w-full h-full"
					/>
				) : cameraError ? (
					<div className="flex items-center justify-center w-full h-full">
						<p className="text-sm text-gray-500">
							카메라를 사용할 수 없습니다.
						</p>
					</div>
				) : (
					<video
						ref={videoRef}
						autoPlay
						playsInline
						muted
						className="object-cover w-full h-full"
					/>
				)}
				{!isCaptured && !cameraError && (
					<button
						onClick={captureImage}
						className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white rounded-full border-2 border-gray-300"
					></button>
				)}
			</div>

			{isCaptured && (
				<div className="flex space-x-2 w-full px-4">
					<button
						onClick={confirmAndUploadImage}
						className="flex-1 px-6 py-2.5 bg-green-500 text-white rounded-2xl min-w-[90px]"
					>
						미션 완료
					</button>
					<button
						onClick={resetCapture}
						className="flex-1 px-6 py-2.5 bg-gray-500 text-white rounded-2xl min-w-[90px]"
					>
						다시 찍기
					</button>
				</div>
			)}

			<canvas ref={canvasRef} className="hidden"></canvas>

			{showToast && (
				<div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white py-2 px-4 rounded-lg shadow-lg">
					{showToast}
				</div>
			)}
		</div>
	);
};

export default ShoppingCompleteModal;
