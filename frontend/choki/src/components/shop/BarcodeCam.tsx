import React, { useRef, useEffect, useState } from 'react';
import Button from '../Common/Button';
import { BrowserMultiFormatReader } from '@zxing/browser';
import AddModal from './AddModal';
import { Toast } from '@/components/Toast/Toast';
import { compareShopping } from '@/lib/api/shopping';

const Cam: React.FC<BarcodeCamProps> = ({
	onCaptureChange,
	originBarcode,
	productName,
	onClose,
}) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [compareResult, setCompareResult] = useState<string | null>(null);
	const [inputBarcode, setInputBarcode] = useState<string | null>(null);
	const [showToast, setShowToast] = useState<boolean>(false);
	const [barcodeReader] = useState(new BrowserMultiFormatReader());

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

	useEffect(() => {
		const startScan = async () => {
			if (videoRef.current) {
				try {
					const deviceId = await getRearCameraDeviceId();
					await barcodeReader.decodeFromVideoDevice(
						deviceId,
						videoRef.current,
						result => {
							if (result) {
								const scannedBarcode = result.getText();
								goCompare(originBarcode, scannedBarcode);
								videoRef.current?.pause();
							}
						},
					);
				} catch (error) {
					console.error('카메라 접근 실패:', error);
				}
			}
		};

		const getRearCameraDeviceId = async () => {
			const devices = await navigator.mediaDevices.enumerateDevices();
			const rearCamera = devices.find(
				device =>
					device.kind === 'videoinput' &&
					device.label.toLowerCase().includes('back'),
			);
			return rearCamera?.deviceId || 'environment';
		};

		startScan();
		return () => {
			videoRef.current?.pause();
		};
	}, [barcodeReader, originBarcode]);

	const handleConfirm = () => {
		onCaptureChange(true);
	};

	return (
		<div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg mx-auto w-[80%] max-w-lg">
			{compareResult ? (
				<AddModal
					conpareResult={compareResult}
					ProductName={productName || '새로 담은 상품'}
					originBarcode={originBarcode}
					inputBarcode={inputBarcode || ''}
					onClose={onClose}
				/>
			) : (
				<>
					<div className="relative mb-4 w-full flex justify-center">
						<video
							ref={videoRef}
							autoPlay
							className="w-full h-full object-cover"
						/>
						{/* 가이드라인 추가 */}
						<div className="absolute inset-0 flex justify-center items-center pointer-events-none">
							<div className="border-2 border-orange-300 w-[80%] h-[20%]"></div>
						</div>
					</div>

					<div className="flex gap-4 mt-4">
						<Button
							size="small"
							color="blue"
							onClick={handleConfirm}
							text="돌아가기"
						/>
					</div>
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
