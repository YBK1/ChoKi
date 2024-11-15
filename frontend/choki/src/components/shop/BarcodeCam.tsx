import React, { useRef, useEffect, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import Button from '../Common/Button';
import AddModal from './AddModal';
import { Toast } from '@/components/Toast/Toast';
import { compareShopping } from '@/lib/api/shopping';

interface CamProps {
	onCaptureChange: (isCaptured: boolean) => void;
	originBarcode: string;
	productName: string;
	onClose: () => void;
}

const Cam: React.FC<CamProps> = ({
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
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: 'environment' },
			});

			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				videoRef.current.setAttribute('playsinline', 'true'); // 모바일 전체 화면 방지
				videoRef.current.play();
			}

			barcodeReader.decodeFromVideoDevice(
				undefined,
				videoRef.current as HTMLVideoElement,
				(result, error) => {
					if (result) {
						const scannedBarcode = result.getText();
						console.log('Scanned Barcode:', scannedBarcode); // 바코드 번호 콘솔 출력
						if (
							(scannedBarcode.length === 13 || scannedBarcode.length === 8) &&
							/^\d+$/.test(scannedBarcode)
						) {
							goCompare(originBarcode, scannedBarcode);
							videoRef.current?.pause(); // 바코드 인식 완료 후 스캔 중지
						}
					} else if (error && error.name !== 'NotFoundException') {
						console.error('바코드 스캔 오류:', error);
					}
				},
			);
		};

		startScan();

		return () => {
			barcodeReader.decodeFromVideoDevice(undefined, undefined, () => {}); // 디코딩 중지
			const currentVideoRef = videoRef.current;
			if (currentVideoRef && currentVideoRef.srcObject) {
				(currentVideoRef.srcObject as MediaStream)
					.getTracks()
					.forEach((track: MediaStreamTrack) => track.stop());
			}
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
						{/* 바코드 인식 가이드 박스 */}
						<div className="absolute top-1/2 left-1/2 w-3/4 h-1/3 transform -translate-x-1/2 -translate-y-1/2 border-4 border-yellow-300 bg-yellow-100 bg-opacity-50 rounded-lg flex items-center justify-center pointer-events-none">
							<p className="text-pink-500 font-bold text-lg text-center">
								여기 바코드를 맞춰주세요!
							</p>
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
