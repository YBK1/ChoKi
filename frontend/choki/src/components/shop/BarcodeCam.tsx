import React, { useRef, useEffect, useState } from 'react';
import Button from '../Common/Button';
import { BrowserMultiFormatReader } from '@zxing/browser';
import AddModal from './AddModal';
import { Toast } from '@/components/Toast/Toast';
import { compareShopping } from '@/lib/api/shopping';

interface ExtendedMediaTrackConstraintSet extends MediaTrackConstraintSet {
	zoom?: number;
	focusMode?: string;
	focusDistance?: number;
}

interface BarcodeCamProps {
	onCaptureChange: (captured: boolean) => void;
	originBarcode: string | null;
	productName?: string;
	onClose: () => void;
	addNewItem?: (newItem: ShoppingItem) => void;
}

const Cam: React.FC<BarcodeCamProps> = ({
	onCaptureChange,
	originBarcode,
	productName,
	onClose,
}) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [compareResult, setCompareResult] = useState<string | null>(null);
	const [inputBarcode, setInputBarcode] = useState<string | null>(null);
	const [showToast, setShowToast] = useState<string | null>(null);
	const [hasPermission, setHasPermission] = useState<boolean>(false);
	const [barcodeReader] = useState(new BrowserMultiFormatReader());
	const checkCameraPermission = async () => {
		try {
			// 바로 getUserMedia를 시도하여 권한 요청
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: 'environment', // 후면 카메라 우선
				},
			});

			// 권한이 허용되면 스트림을 즉시 중지
			stream.getTracks().forEach(track => track.stop());
			setHasPermission(true);

			try {
				// permissions.query는 선택적으로 시도
				const permission = await navigator.permissions.query({
					name: 'camera' as PermissionName,
				});

				permission.addEventListener('change', () => {
					if (permission.state === 'denied') {
						setHasPermission(false);
						setShowToast('카메라 권한이 거부되었습니다.');
					} else {
						setHasPermission(true);
					}
				});
			} catch {
				// permissions.query가 실패해도 getUserMedia가 성공했다면 권한이 있는 것으로 간주
				console.log(
					'권한 모니터링은 지원되지 않지만, 카메라는 사용 가능합니다.',
				);
			}
		} catch (error) {
			console.error('권한 확인 실패:', error);
			setShowToast('카메라 권한을 허용해주세요.');
			setHasPermission(false);
			throw error;
		}
	};

	const applyFocusConstraints = async (videoTrack: MediaStreamTrack) => {
		const capabilities = videoTrack.getCapabilities() as Partial<{
			focusMode?: string[];
			focusDistance?: { min: number; max: number; step: number };
			zoom?: { min: number; max: number; step: number };
		}>;

		const constraints: ExtendedMediaTrackConstraintSet = {
			focusMode: 'continuous', // 자동 초점 모드
			focusDistance: 0.5, // 중간 거리
			zoom: 1.0, // 기본 배율
		};

		if (capabilities.focusMode?.includes('manual')) {
			await videoTrack.applyConstraints({
				advanced: [constraints],
			});
			console.log('카메라 초점: 수동 모드 활성화');
		} else {
			console.warn('카메라가 수동 초점 모드를 지원하지 않습니다.');
		}
	};

	// const getRearCameraStream = async (): Promise<MediaStream> => {
	// 	try {
	// 		const devices = await navigator.mediaDevices.enumerateDevices();
	// 		const videoDevices = devices.filter(
	// 			device => device.kind === 'videoinput',
	// 		);

	// 		const rearCamera = videoDevices.find(device =>
	// 			device.label.toLowerCase().includes('back'),
	// 		);

	// 		// 고화질 설정으로 변경
	// 		const constraints: MediaStreamConstraints = {
	// 			video: {
	// 				...(rearCamera
	// 					? { deviceId: rearCamera.deviceId }
	// 					: { facingMode: 'environment' }),
	// 				width: { ideal: 1920 }, // 4K
	// 				height: { ideal: 1080 },
	// 				aspectRatio: { ideal: 16 / 9 },
	// 			},
	// 		};

	// 		return await navigator.mediaDevices.getUserMedia(constraints);
	// 	} catch (error) {
	// 		console.error('후면 카메라 탐지 실패:', error);
	// 		throw error;
	// 	}
	// };
	const getRearCameraStream = async (): Promise<MediaStream> => {
		try {
			const devices = await navigator.mediaDevices.enumerateDevices();
			const videoDevices = devices.filter(
				device => device.kind === 'videoinput',
			);

			// 후면 카메라 찾기 - wide 카메라 제외
			const rearCamera = videoDevices.find(
				device =>
					(device.label.toLowerCase().includes('back') ||
						device.label.toLowerCase().includes('rear')) &&
					!device.label.toLowerCase().includes('wide'),
			);

			// 단순화된 constraints
			const constraints = rearCamera
				? { video: { deviceId: rearCamera.deviceId } }
				: { video: { facingMode: { exact: 'environment' } } };

			const stream = await navigator.mediaDevices.getUserMedia(constraints);

			// 기본 줌 설정
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

	// const checkCameraPermission = async () => {
	// 	try {
	// 		// 실제 카메라 접근을 먼저 시도
	// 		const stream = await navigator.mediaDevices.getUserMedia({ video: true });
	// 		stream.getTracks().forEach(track => track.stop()); // 테스트 스트림 정리

	// 		// 권한이 허용된 후 permissions API 확인
	// 		const permission = await navigator.permissions.query({
	// 			name: 'camera' as PermissionName,
	// 		});

	// 		if (permission.state === 'denied') {
	// 			setHasPermission(false);
	// 			throw new Error('카메라 권한이 거부되었습니다.');
	// 		} else {
	// 			setHasPermission(true);
	// 		}
	// 	} catch (error) {
	// 		console.error('권한 확인 실패:', error);
	// 		setShowToast('카메라 권한을 허용해주세요.');
	// 		setHasPermission(false);
	// 		throw error;
	// 	}
	// };
	const sharpenImage = (
		ctx: CanvasRenderingContext2D,
		canvas: HTMLCanvasElement,
	) => {
		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		const data = imageData.data;

		const sharpenFactor = 2.0;
		const contrast = 1.2;

		for (let i = 0; i < data.length; i += 4) {
			data[i] = Math.min(
				((data[i] / 255 - 0.5) * contrast + 0.5) * 255 * sharpenFactor,
				255,
			);
			data[i + 1] = Math.min(
				((data[i + 1] / 255 - 0.5) * contrast + 0.5) * 255 * sharpenFactor,
				255,
			);
			data[i + 2] = Math.min(
				((data[i + 2] / 255 - 0.5) * contrast + 0.5) * 255 * sharpenFactor,
				255,
			);
		}

		ctx.putImageData(imageData, 0, 0);
	};

	const scanBarcodeFromCanvas = async () => {
		if (canvasRef.current && videoRef.current) {
			const canvas = canvasRef.current;
			const ctx = canvas.getContext('2d');

			if (ctx) {
				const video = videoRef.current;

				const scanBox = {
					x: video.videoWidth * 0.1,
					y: video.videoHeight * 0.4,
					width: video.videoWidth * 0.8,
					height: video.videoHeight * 0.2,
				};

				canvas.width = scanBox.width;
				canvas.height = scanBox.height;

				ctx.drawImage(
					video,
					scanBox.x,
					scanBox.y,
					scanBox.width,
					scanBox.height,
					0,
					0,
					scanBox.width,
					scanBox.height,
				);

				sharpenImage(ctx, canvas);

				try {
					const result = await barcodeReader.decodeFromCanvas(canvas);
					if (result) {
						const scannedBarcode = result.getText();
						setInputBarcode(scannedBarcode);
						goCompare(originBarcode || '', scannedBarcode);
						onCaptureChange(true);
					}
				} catch (error) {
					console.log('바코드 탐지 실패:', error);
				}
			}
		}
	};

	const goCompare = async (originBarcode: string, inputBarcode: string) => {
		try {
			if (!originBarcode) {
				setCompareResult('MATCH');
			} else {
				const response = await compareShopping({ originBarcode, inputBarcode });
				setCompareResult(response.matchStatus);
			}
		} catch (error) {
			console.error('장보기 비교 실패:', error);
		}
	};

	const startScan = async () => {
		if (videoRef.current) {
			try {
				const stream = await getRearCameraStream();
				const videoTrack = stream.getVideoTracks()[0];
				await applyFocusConstraints(videoTrack);

				videoRef.current.srcObject = stream;
				const intervalId = setInterval(scanBarcodeFromCanvas, 500);

				return () => clearInterval(intervalId);
			} catch (error) {
				console.error('카메라 접근 실패:', error);
				setShowToast(
					'카메라를 사용할 수 없습니다. 권한을 확인하거나 재시도해주세요.',
				);
			}
		}
	};

	useEffect(() => {
		const checkPermissionsAndStart = async () => {
			try {
				await checkCameraPermission();
				if (hasPermission) {
					await startScan();
				}
			} catch (error) {
				console.error('카메라 권한 부족 또는 접근 실패:', error);
				setShowToast('기기에서 카메라 권한을 허용해주세요.');
			}
		};

		checkPermissionsAndStart();

		return () => {
			if (videoRef.current) {
				const stream = videoRef.current.srcObject as MediaStream;
				stream?.getTracks().forEach(track => track.stop());
			}
		};
	}, [barcodeReader, originBarcode, hasPermission]);

	return (
		<div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg mx-auto w-[80%] max-w-lg">
			{compareResult ? (
				<AddModal
					conpareResult={compareResult}
					ProductName={productName || '새로 담은 상품'}
					originBarcode={originBarcode || ''}
					inputBarcode={inputBarcode || ''}
					onClose={onClose}
				/>
			) : (
				<>
					<div className="relative mb-4 w-full flex justify-center">
						<video
							ref={videoRef}
							autoPlay
							playsInline
							muted
							className="w-full h-full object-cover"
						/>
						<canvas ref={canvasRef} className="hidden" />
						<div className="absolute inset-0 flex justify-center items-center pointer-events-none">
							<div className="border-2 border-orange-300 w-[80%] h-[20%]">
								<span className="text-white mt-2 text-sm bg-opacity-50 px-2 py-1 rounded">
									바코드를 박스 안에 맞춰주세요
								</span>
							</div>
						</div>
					</div>

					<div className="flex gap-4 mt-4">
						<Button size="small" color="blue" onClick={onClose} text="닫기" />
					</div>
				</>
			)}

			{showToast && (
				<Toast
					message="카메라를 사용할 수 없습니다. 권한을 확인하거나 재시도해주세요."
					onClose={() => setShowToast(null)}
				/>
			)}
		</div>
	);
};

export default Cam;
