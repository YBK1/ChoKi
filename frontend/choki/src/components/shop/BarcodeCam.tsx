import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Button from '../Common/Button';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { compareShopping } from '@/lib/api/shopping';
import AddModal from './AddModal';

interface CamProps {
	onCaptureChange: (isCaptured: boolean) => void;
	originBarcode: string;
	productName: string;
	addNewItem: (newItem: ShoppingItem) => void; // 물품 추가 함수 추가
	onClose: () => void; // 모달 닫기 함수 추가
}

const Cam: React.FC<CamProps> = ({
	onCaptureChange,
	originBarcode,
	productName,
	onClose, // 모달 닫기 함수 prop 추가
}) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [capturedImage, setCapturedImage] = useState<string | null>(null);
	const [compareResult, setCompareResult] = useState<string | null>(null);
	const [inputBarcode, setInputBarcode] = useState<string | null>(null);

	const goCompare = async (originBarcode: string, inputBarcode: string) => {
		try {
			const response = await compareShopping({ originBarcode, inputBarcode });
			const matchStatus = response.matchStatus;
			setCompareResult(matchStatus);
			setInputBarcode(inputBarcode);
		} catch (error) {
			console.error('장보기 비교 실패:', error);
		}
	};

	const startCamera = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true });
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

	const captureImage = async () => {
		if (videoRef.current) {
			const videoWidth = videoRef.current.videoWidth;
			const videoHeight = videoRef.current.videoHeight;
			const canvas = document.createElement('canvas');
			canvas.width = videoWidth;
			canvas.height = videoHeight;

			const ctx = canvas.getContext('2d');
			if (ctx) {
				ctx.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);
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
						goCompare('88002903', '8801069174839');
					}
				};
			}
		}
	};

	const handleConfirm = () => {
		onCaptureChange(true);
	};

	return (
		<div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg mx-auto w-[80%] max-w-lg">
			{compareResult ? (
				<AddModal
					conpareResult={compareResult}
					ProductName={productName}
					originBarcode={originBarcode}
					inputBarcode={inputBarcode || ''}
					onClose={onClose} // AddModal에 모달 닫기 함수 전달
					// addNewItem={addNewItem} // AddModal에 물품 추가 함수 전달
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
				</>
			)}
		</div>
	);
};

export default Cam;
