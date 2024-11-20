import React, { useRef, useEffect, useState } from 'react';
import Button from '../Common/Button';
import { BrowserMultiFormatReader } from '@zxing/browser';
import AddModal from './AddModal';
import { Toast } from '@/components/Toast/Toast';
import { compareShopping } from '@/lib/api/shopping';

// Extended interface for zoom support
interface ExtendedMediaTrackConstraintSet extends MediaTrackConstraintSet {
	zoom?: number;
}

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

	// 후면 카메라 스트림 가져오기
	const getRearCameraStream = async () => {
		try {
			const devices = await navigator.mediaDevices.enumerateDevices();
			const videoDevices = devices.filter(
				device => device.kind === 'videoinput',
			);

			const rearCamera = videoDevices.find(
				device =>
					(device.label.toLowerCase().includes('back') ||
						device.label.toLowerCase().includes('rear')) &&
					!device.label.toLowerCase().includes('wide'),
			);

			const constraints = rearCamera
				? { video: { deviceId: rearCamera.deviceId } }
				: { video: { facingMode: { exact: 'environment' } } };

			const stream = await navigator.mediaDevices.getUserMedia(constraints);

			const videoTrack = stream.getVideoTracks()[0];
			const capabilities =
				videoTrack.getCapabilities() as MediaTrackCapabilities & {
					zoom?: number;
				};

			if (capabilities.zoom) {
				await videoTrack.applyConstraints({
					advanced: [{ zoom: 1.0 } as ExtendedMediaTrackConstraintSet],
				});
			}

			return stream;
		} catch (error) {
			console.error('후면 카메라 탐지 실패:', error);
			throw error;
		}
	};

	// 바코드 비교 함수
	const goCompare = async (originBarcode: string, inputBarcode: string) => {
		try {
			if (!originBarcode) {
				setCompareResult('MATCH');
				setInputBarcode(inputBarcode);
			} else {
				const response = await compareShopping({ originBarcode, inputBarcode });
				setCompareResult(response.matchStatus);
				setInputBarcode(inputBarcode);
			}
		} catch (error) {
			console.error('장보기 비교 실패:', error);
		}
	};

	// 스캔 시작
	const startScan = async () => {
		if (videoRef.current) {
			try {
				const stream = await getRearCameraStream();
				videoRef.current.srcObject = stream;

				barcodeReader.decodeFromVideoElement(videoRef.current, result => {
					if (result) {
						const scannedBarcode = result.getText();
						goCompare(originBarcode, scannedBarcode);
						videoRef.current?.pause();
					}
				});
			} catch (error) {
				console.error('카메라 접근 실패:', error);
				setShowToast(true);
			}
		}
	};

	useEffect(() => {
		const checkPermissionsAndStart = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					video: true,
				});
				stream.getTracks().forEach(track => track.stop());
				await startScan();
			} catch (error) {
				console.error('카메라 권한 부족 또는 접근 실패:', error);
				setShowToast(true);
			}
		};

		checkPermissionsAndStart();

		return () => {
			if (videoRef.current) {
				const stream = videoRef.current.srcObject as MediaStream;
				stream?.getTracks().forEach(track => track.stop());
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
						<div className="absolute inset-0 bg-black bg-opacity-50 pointer-events-none"></div>
						<div className="absolute inset-0 flex justify-center items-center pointer-events-none">
							<div className="border-2 border-orange-300 w-[80%] h-[20%]">
								<span className="text-white mt-2 text-sm bg-opacity-50 px-2 py-1 rounded">
									바코드를 박스 안에 맞춰주세요
								</span>
							</div>
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
					message="카메라를 사용할 수 없습니다. 권한을 확인하거나 재시도해주세요."
					onClose={() => setShowToast(false)}
				/>
			)}
		</div>
	);
};

export default Cam;
