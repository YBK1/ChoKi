import { getKidData } from '@/lib/api/kid';
import { useCallback, useEffect, useState } from 'react';
import UnityViewer from '@/components/Unity/UnityViewer';

declare global {
	interface Window {
		UnityReadyCallback?: () => void;
	}
}

export default function MainPage() {
	const [isUnityLoaded, setIsUnityLoaded] = useState(false);
	const [pendingData, setPendingData] = useState<any>(null);

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
			if (!isUnityLoaded) {
				console.warn('Unity is not loaded yet. 데이터를 대기열에 추가합니다.');
				setPendingData(data);
				return;
			}
			const iframe = document.getElementById(
				'unity-iframe',
			) as HTMLIFrameElement;

			if (
				iframe &&
				iframe.contentWindow &&
				iframe.contentWindow.unityInstance
			) {
				const unityData: UnityMainResponse = {
					userId: data.userId,
					nickname: data.nickname,
					level: data.level,
					exp: data.exp,
					isLevelUp: data.isLevelUp ? 1 : 0, // Convert boolean to 0 or 1 for Unity
					mainAnimalId: data.mainAnimalId,
					animals: data.animals,
				};
				const jsonData = JSON.stringify(unityData);
				try {
					const unityInstance = iframe.contentWindow.unityInstance;
					unityInstance.SendMessage(
						'DataReceiver',
						'receiveDataFromUnity',
						jsonData,
					);
					console.log('Data sent to Unity:', unityData);
				} catch (error) {
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
		</div>
	);
}
