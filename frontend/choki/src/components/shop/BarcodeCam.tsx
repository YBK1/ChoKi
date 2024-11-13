import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Button from '../Common/Button';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { compareShopping } from '@/lib/api/shopping';
import AddModal from './AddModal';
import { Toast } from '@/components/Toast/Toast';
// import { shoppingListAtom, addShoppingItem } from '@/atoms/shoppingAtom';
// import { useAtom } from 'jotai';
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
	// const [, setShoppingList] = useAtom(shoppingListAtom);
	const videoRef = useRef<HTMLVideoElement>(null);
	const [capturedImage, setCapturedImage] = useState<string | null>(null);
	const [compareResult, setCompareResult] = useState<string | null>(null);
	const [inputBarcode, setInputBarcode] = useState<string | null>(null);
	const [showToast, setShowToast] = useState<boolean>(false); // 토스트 메시지 상태 추가

	const goCompare = async (originBarcode: string, inputBarcode: string) => {
		try {
			// TODO - 아이가 추가한 물품일 경우
			if (originBarcode === '') {
				// addShoppingItem(setShoppingList, {)
				setCompareResult('MATCH'); // 아이가 추가로 담은 물품은 일치로 판별
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
				video: {
					facingMode: { ideal: 'environment' }, // 후면 카메라 사용
					width: { ideal: 1280 }, // 해상도를 적절히 설정
					height: { ideal: 720 },
				},
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
						setShowToast(true); // 바코드 찾지 못했을 때 토스트 표시
					}
				};
			}
		}
	};

	const handleConfirm = () => {
		onCaptureChange(true);
	};

	const handleRetake = () => {
		// 상태를 초기화하여 다시 촬영할 수 있게 설정
		setCapturedImage(null);
		setCompareResult(null);
		setInputBarcode(null);
		setShowToast(false); // 토스트 메시지도 초기화
		startCamera(); // 카메라를 다시 시작하여 비디오를 표시
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
								text="돌아가기"
							/>
							<Button
								size="small"
								color="blue"
								onClick={handleRetake}
								text="다시 찍기"
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

			{/* 토스트 메시지 */}
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
