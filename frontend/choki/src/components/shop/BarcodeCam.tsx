import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Button from '../Common/Button';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { compareShopping } from '@/lib/api/shopping';
import AddModal from './AddModal';
import { Toast } from '@/components/Toast/Toast';

interface CamProps {
	onCaptureChange: (isCaptured: boolean) => void;
	originBarcode: string;
	productName: string;
	addNewItem: (newItem: ShoppingItem) => void;
	onClose: () => void;
}

const Cam: React.FC<CamProps> = ({
	onCaptureChange,
	originBarcode,
	productName,
	onClose,
}) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [capturedImage, setCapturedImage] = useState<string | null>(null);
	const [compareResult, setCompareResult] = useState<string | null>(null);
	const [inputBarcode, setInputBarcode] = useState<string | null>(null);
	const [showToast, setShowToast] = useState<boolean>(false);

	const goCompare = async (originBarcode: string, inputBarcode: string) => {
		try {
			if (originBarcode === '') {
				setCompareResult('MATCH');
				setInputBarcode(inputBarcode);
			} else {
				const response = await compareShopping({ originBarcode, inputBarcode });
				const matchStatus = response.matchStatus;
				setCompareResult(matchStatus);
				setInputBarcode(inputBarcode);
			}
		} catch (error) {
			console.error('장보기 비교 실패:', error);
		}
	};

	const startCamera = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: { ideal: 'environment' } },
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
		return () => {
			if (videoRef.current && videoRef.current.srcObject) {
				(videoRef.current.srcObject as MediaStream)
					.getTracks()
					.forEach(track => track.stop());
			}
		};
	}, []);

	const captureCenterImage = async () => {
		if (videoRef.current) {
			const videoWidth = videoRef.current.videoWidth;
			const videoHeight = videoRef.current.videoHeight;
			const centerWidth = videoWidth * 0.5; // 중앙부 가이드 영역 너비 (50%)
			const centerHeight = videoHeight * 0.25; // 중앙부 가이드 영역 높이 (25%)

			const canvas = document.createElement('canvas');
			canvas.width = centerWidth;
			canvas.height = centerHeight;

			const ctx = canvas.getContext('2d');
			if (ctx) {
				// 중앙부 영역을 캡처
				ctx.drawImage(
					videoRef.current,
					(videoWidth - centerWidth) / 2, // 중앙부 x 시작점
					(videoHeight - centerHeight) / 2, // 중앙부 y 시작점
					centerWidth,
					centerHeight,
					0,
					0,
					centerWidth,
					centerHeight,
				);
				const imageDataUrl = canvas.toDataURL('image/png');
				setCapturedImage(imageDataUrl);

				const codeReader = new BrowserMultiFormatReader();
				const imgElement = document.createElement('img');
				imgElement.src = imageDataUrl;

				imgElement.onload = async () => {
					try {
						const result = await codeReader.decodeFromImageElement(imgElement);
						const inputBarcode = result.getText();
						goCompare(originBarcode, inputBarcode);
					} catch {
						console.log('바코드를 찾을 수 없습니다. 재촬영 해주세요.');
						setShowToast(true);
					}
				};
			}
		}
	};

	return (
		<div className="relative flex flex-col items-center p-4 bg-white rounded-lg shadow-lg mx-auto w-[80%] max-w-lg">
			{/* 바코드 가이드 오버레이 */}
			<div className="absolute inset-0 flex justify-center items-center pointer-events-none">
				<div className="w-1/2 h-1/4 border-2 border-dashed border-red-500"></div>
			</div>

			{compareResult ? (
				<AddModal
					conpareResult={compareResult}
					ProductName={productName}
					originBarcode={originBarcode}
					inputBarcode={inputBarcode || ''}
					onClose={onClose}
				/>
			) : (
				<>
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
								onClick={() => onCaptureChange(true)}
								text="돌아가기"
							/>
							<Button
								size="small"
								color="blue"
								onClick={() => {
									setCapturedImage(null);
									setCompareResult(null);
									setInputBarcode(null);
									setShowToast(false);
									startCamera();
								}}
								text="다시 찍기"
							/>
						</div>
					) : (
						<div onClick={captureCenterImage} className="cursor-pointer mt-2">
							<Image
								src="/icons/camera_icon.svg"
								alt="Capture Image"
								width={50}
								height={50}
								className="hover:scale-110 transition-transform"
							/>
						</div>
					)}
				</>
			)}

			{showToast && (
				<Toast
					message="바코드를 찾을 수 없습니다. 재촬영 해주세요."
					onClose={() => setShowToast(false)}
				/>
			)}
		</div>
	);
};

export default Cam;
