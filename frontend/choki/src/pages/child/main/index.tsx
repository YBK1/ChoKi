import { getMissionList, getUserData } from '@/lib/api/user';
import { useEffect, useState } from 'react';
import UnityViewer from '@/components/Unity/UnityViewer';
import { userAtom } from '@/atoms';
import { useAtom } from 'jotai';

declare global {
	interface Window {
		UnityReadyCallback?: () => void;
		handleUnityShowPanel?: () => Promise<void>;
		unityInstance?: any;
	}
}

interface UnityMainResponse {
	userId: number;
	nickname: string;
	level: number;
	exp: number;
	isLevelUp: number;
	mainAnimalId: number;
	animals: number[];
}

export default function MainPage() {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [isUnityLoaded, setIsUnityLoaded] = useState(false);
	const [pendingData, setPendingData] = useState<UserProfile | null>(null);
	const [user] = useAtom(userAtom);

	// Unity로 데이터를 전송하는 함수
	function sendDataToUnity(data: UserProfile) {
		if (!isUnityLoaded) {
			console.warn('Unity is not loaded yet. 데이터를 대기열에 추가합니다.');
			setPendingData(data);
			return;
		}

		const iframe = document.getElementById('unity-iframe') as HTMLIFrameElement;
		if (iframe?.contentWindow?.unityInstance) {
			// UserProfile 데이터를 UnityMainResponse 형식으로 변환
			const unityData: UnityMainResponse = {
				userId: data.userId,
				nickname: data.nickname,
				level: data.level,
				exp: data.exp,
				isLevelUp: data.isLevelUp ? 1 : 0,
				mainAnimalId: data.mainAnimalId,
				animals: data.animals,
			};
			try {
				iframe.contentWindow.unityInstance.SendMessage(
					'DataReceiver',
					'receiveDataFromUnity',
					JSON.stringify(unityData),
				);
				console.log('Data sent to Unity:', unityData);
			} catch (error) {
				console.error('Error sending data to Unity:', error);
			}
		} else {
			console.error('iframe 또는 unityInstance가 정의되지 않았습니다.');
		}
	}

	// Unity와의 상호작용을 위한 설정 및 해제
	useEffect(() => {
		window.UnityReadyCallback = () => setIsUnityLoaded(true);

		window.handleUnityShowPanel = async () => {
			if (user.userId) {
				try {
					const missionData = await getMissionList(user.userId);
					sendDataToUnity(missionData as unknown as UserProfile); // UserProfile 형식으로 타입 단언
				} catch (error) {
					console.error('미션 데이터 가져오기 실패:', error);
					setErrorMessage(`Error fetching mission data: ${error}`);
				}
			} else {
				console.warn('userId가 설정되지 않았습니다.');
			}
		};

		return () => {
			delete window.UnityReadyCallback;
			delete window.handleUnityShowPanel;
		};
	}, [user.userId]);

	// Unity 로드 시, 대기 중인 데이터 전송
	useEffect(() => {
		if (isUnityLoaded && pendingData) {
			sendDataToUnity(pendingData);
			setPendingData(null); // 전송 후 대기열 비우기
		}
	}, [isUnityLoaded, pendingData]);

	// 페이지 로드 시 세션 스토리지에서 pendingData 불러오기
	useEffect(() => {
		const storedData = sessionStorage.getItem('pendingData');
		if (storedData) {
			setPendingData(JSON.parse(storedData));
		}
	}, []);

	// 사용자 정보 가져오기 및 Unity로 전송
	async function handleUnityLoaded() {
		const kidData = await getUserData().catch(error => {
			console.error('Error fetching kid data:', error);
			setErrorMessage(`Error fetching data: ${error}`);
			return null;
		});
		if (kidData) sendDataToUnity(kidData as unknown as UserProfile); // UserProfile 형식으로 타입 단언
	}

	// pendingData 변경 시 세션 스토리지에 저장
	useEffect(() => {
		if (pendingData) {
			sessionStorage.setItem('pendingData', JSON.stringify(pendingData));
		} else {
			sessionStorage.removeItem('pendingData');
		}
	}, [pendingData]);

	return (
		<div className="relative">
			<UnityViewer onUnityLoaded={handleUnityLoaded} />
			{errorMessage && (
				<div className="absolute top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
					{errorMessage}
				</div>
			)}
		</div>
	);
}
