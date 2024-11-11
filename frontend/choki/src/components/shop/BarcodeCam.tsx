import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Button from '../Common/Button';
import { BrowserMultiFormatReader } from '@zxing/browser';

interface CamProps {
	onCaptureChange: (captured: boolean) => void;
	onCaptureImage?: (imageDataUrl: string) => void;
}

const Cam: React.FC<CamProps> = ({ onCaptureChange, onCaptureImage }) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [capturedImage, setCapturedImage] = useState<string | null>(null);

	const startCamera = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: true,
			});
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				videoRef.current.play();
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

	const captureImage = async () => {
		if (videoRef.current) {
			// 비디오의 실제 해상도를 기반으로 캔버스 크기 설정
			const videoWidth = videoRef.current.videoWidth;
			const videoHeight = videoRef.current.videoHeight;
			const canvas = document.createElement('canvas');
			canvas.width = videoWidth;
			canvas.height = videoHeight;

			const ctx = canvas.getContext('2d');
			if (ctx) {
				// video 요소에 표시된 화면을 그대로 캡처
				ctx.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);

				const imageDataUrl = canvas.toDataURL('image/png');
				setCapturedImage(imageDataUrl);
				console.log('캡처된 이미지 데이터 URL:', imageDataUrl);

				const codeReader = new BrowserMultiFormatReader();

				const imgElement = document.createElement('img');
				imgElement.src = imageDataUrl;

				imgElement.onload = async () => {
					try {
						const result = await codeReader.decodeFromImageElement(imgElement);
						if (result) {
							console.log('인식된 바코드:', result.getText());
							if (onCaptureImage) {
								onCaptureImage(result.getText());
							}
						}
					} catch {
						console.log('바코드를 찾을 수 없습니다. 재촬영 해주세요.');
					}
				};
			} else {
				console.error('캔버스 컨텍스트를 가져올 수 없습니다.');
			}
		} else {
			console.error('비디오 요소가 초기화되지 않았습니다.');
		}
	};

	const handleConfirm = () => {
		onCaptureChange(true);
	};

	return (
		<div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg mx-auto w-[80%] max-w-lg">
			<div className="mb-4 w-full flex justify-center">
				<div className="bg-gray-200 rounded-md shadow-md overflow-hidden w-80 h-36 flex items-center justify-center">
					{capturedImage ? (
						<Image
							src={capturedImage}
							alt="Captured"
							width={320}
							height={150}
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

			{capturedImage ? (
				<div className="flex gap-4 mt-4">
					<Button
						size="small"
						color="blue"
						onClick={handleConfirm}
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
