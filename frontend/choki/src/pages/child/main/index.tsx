<<<<<<< HEAD
import { getUserData } from '@/lib/api/user';
import { useEffect } from 'react';
import UnityViewer from '@/components/Unity/UnityVierwer';
export default function MainPage() {
	// Unity로 데이터 전송하는 함수
	const sendDataToUnity = (data: ChildMainUnityProps) => {
		const iframe = document.getElementById('unity-iframe') as HTMLIFrameElement;
		if (iframe && iframe.contentWindow) {
			const jsonData = JSON.stringify(data);
			iframe.contentWindow.postMessage(
				{ type: 'sendData', data: jsonData },
				'*',
			);
		}
	};

	// 데이터 가져오기 함수
	const getKidInfo = async () => {
		try {
			const kidData = await getUserData();
			console.log(kidData);

			// Unity로 데이터 전송
			sendDataToUnity(kidData);
		} catch (error) {
			console.error('데이터를 가져오는 중 오류 발생:', error);
		}
	};
=======
import { getKidData } from '@/lib/api/kid';
import { useCallback, useEffect, useState } from 'react';
import UnityViewer from '@/components/Unity/UnityViewer';

declare global {
	interface Window {
		UnityReadyCallback?: () => void;
	}
}

export default function MainPage() {
	const [isDataSent, setIsDataSent] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isUnityLoaded, setIsUnityLoaded] = useState(false);
	const [pendingData, setPendingData] = useState<any>(null);
>>>>>>> develop/fe

	useEffect(() => {
		window.UnityReadyCallback = () => {
			console.log('Unity is fully loaded and ready.');
			setIsUnityLoaded(true);
		};

		return () => {
			delete window.UnityReadyCallback;
		};
	}, []);

	useEffect(() => {
		if (isUnityLoaded && pendingData) {
			console.log('Unity가 로드되었고, 데이터를 전송합니다.');
			sendDataToUnity(pendingData);
			setPendingData(null);
		}
	}, [isUnityLoaded, pendingData]);

	const sendDataToUnity = useCallback(
		(data: any) => {
			console.log('와우 이건 찍히겠지??????');

			if (!isUnityLoaded) {
				console.warn('Unity is not loaded yet. 데이터를 대기열에 추가합니다.');
				setPendingData(data);
				return;
			}

			console.log('일단 여기까지 왔고??');
			const iframe = document.getElementById(
				'unity-iframe',
			) as HTMLIFrameElement;

			if (
				iframe &&
				iframe.contentWindow &&
				iframe.contentWindow.unityInstance
			) {
				const unityData = {
					nickname: data.nickname || '',
					level: data.level || 1,
					exp: data.exp || 0,
					pastLevel: data.pastLevel || 0,
					mainAnimalId: data.mainAnimalId || 0,
				};

				console.log('보내기 직전임!!!!');

				const jsonData = JSON.stringify(unityData);
				try {
					const unityInstance = iframe.contentWindow.unityInstance;
					console.log('자 이제 보낸다!!');
					unityInstance.SendMessage(
						'DataReceiver',
						'receiveDataFromUnity',
						jsonData,
					);
					setIsDataSent(true);
					setErrorMessage(null);
					console.log('Data sent to Unity:', unityData);
				} catch (error) {
					setIsDataSent(false);
					setErrorMessage(`Error sending data: ${error}`);
					console.error('Error sending data to Unity:', error);
				}
			} else {
				console.error('iframe 또는 unityInstance가 정의되지 않았습니다.');
			}
		},
		[isUnityLoaded],
	);

	const getKidInfo = useCallback(async () => {
		try {
			const kidData = await getKidData();
			console.log('Kid data received:', kidData);
			return kidData;
		} catch (error) {
			console.error('Error fetching kid data:', error);
			setErrorMessage(`Error fetching data: ${error}`);
			return null;
		}
	}, []);

	const handleUnityLoaded = useCallback(async () => {
		console.log('Unity iframe loaded, preparing to send data...');
		const kidData = await getKidInfo();
		if (kidData) {
			sendDataToUnity(kidData);
		}
	}, [getKidInfo, sendDataToUnity]);

	return (
		<div className="relative">
			<UnityViewer onUnityLoaded={handleUnityLoaded} />
			{errorMessage && (
				<div className="absolute top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
					{errorMessage}
				</div>
			)}
			{isDataSent && (
				<div className="absolute top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
					Data successfully sent to Unity
				</div>
			)}
		</div>
	);
}
