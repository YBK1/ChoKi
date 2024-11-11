import { getMissionList } from '@/lib/api/user';
import { getUserData } from '@/lib/api/user';
import { useCallback, useEffect, useState } from 'react';
import UnityViewer from '@/components/Unity/UnityViewer';
import { userAtom } from '@/atoms';
import { useAtom } from 'jotai';

declare global {
	interface Window {
		UnityReadyCallback?: () => void;
		handleUnityShowPanel?: () => Promise<void>;
	}
}

export default function MainPage() {
	const [isDataSent, setIsDataSent] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isUnityLoaded, setIsUnityLoaded] = useState(false);
	const [pendingData, setPendingData] = useState<any>(null);
	const [user] = useAtom(userAtom);

	console.log('나오나보자.', user.userId);
	console.log('너도 봐보자.', isUnityLoaded);

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
		window.handleUnityShowPanel = async () => {
			console.log(user.userId);
			if (user.userId !== 0) {
				console.log('Unity에서 ShowPanel 호출됨, 미션 데이터를 가져옵니다.');
				try {
					const missionData = await getMissionList(user.userId);
					console.log('미션 데이터:', missionData);
					sendMissionDataToUnity(missionData); // Unity로 미션 데이터를 전송
				} catch (error) {
					console.error('미션 데이터 가져오기 실패:', error);
					setErrorMessage(`Error fetching mission data: ${error}`);
				}
			} else {
				console.warn('userId가 설정되지 않았습니다.');
			}
		};
		return () => {
			delete window.handleUnityShowPanel;
		};
	}, []);

	useEffect(() => {
		console.log('와와와와와와ㅣ와ㅗ아와와', pendingData);

		if (isUnityLoaded && pendingData) {
			console.log('Unity가 로드되었고, 데이터를 전송합니다.');
			sendDataToUnity(pendingData);
			setPendingData(null);
		}
	}, [isUnityLoaded, pendingData]);

	function sendMissionDataToUnity(missions: InProgressMissionResponse) {
		console.log('일단 여기까지 왔고??222222');
		const jsonData = JSON.stringify({ missions });

		// unityInstance를 iframe을 통해 가져오도록 변경
		const iframe = document.getElementById('unity-iframe') as HTMLIFrameElement;
		if (iframe && iframe.contentWindow && iframe.contentWindow.unityInstance) {
			try {
				iframe.contentWindow.unityInstance.SendMessage(
					'DataReceiver',
					'receiveMissionDataFromUnity',
					jsonData,
				);
				console.log('Mission data sent to Unity:', missions);
			} catch (error) {
				console.error('Error sending mission data to Unity:', error);
			}
		} else {
			console.error('iframe 또는 unityInstance가 정의되지 않았습니다.');
		}
	}

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
				const unityData: UnityMainResponse = {
					userId: data.userId,
					nickname: data.nickname,
					level: data.level,
					exp: data.exp,
					isLevelUp: data.isLevelUp ? 1 : 0,
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

	const getKidInfo = async () => {
		try {
			const kidData = await getUserData();
			return kidData;
		} catch (error) {
			// setErrorMessage("")
		}
		return null;
	};

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
