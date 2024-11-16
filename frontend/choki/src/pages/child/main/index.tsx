import { getMissionList } from '@/lib/api/user';
import { getUserData } from '@/lib/api/user';
import { useCallback, useEffect, useState } from 'react';
import UnityViewer from '@/components/Unity/UnityViewer';
import { userAtom } from '@/atoms';
import { useAtom } from 'jotai';
import router from 'next/router';
import { changeMainAnimal } from '@/lib/api/unity';

declare global {
	interface Window {
		UnityReadyCallback?: () => void;
		RequestUserData?: () => Promise<void>;
		handleUnityShowPanel?: () => Promise<void>;
		navigateToMap?: () => void;
		navigateToShopping?: (missionId: string) => void;
		navigateToRecycling?: (missionId: string) => void;
		changeRepresentativeAnimal?: (animalId: number) => void;
		createUnityInstance?: (
			canvas: HTMLCanvasElement,
			config: {
				dataUrl: string;
				frameworkUrl: string;
				codeUrl: string;
				streamingAssetsUrl: string;
				companyName: string;
				productName: string;
				productVersion: string;
			},
			onProgress: (progress: number) => void,
		) => Promise<any>; // Replace 'any' with a specific Unity instance type if available
	}
}

export default function MainPage() {
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

		window.RequestUserData = async () => {
			console.log('Unity에서 데이터 갱신 요청됨');
			try {
				const kidData = await getUserData();
				if (kidData) {
					sendDataToUnity(kidData);
					console.log('Unity로 새로운 데이터 전송 완료');
				}
			} catch (error) {
				console.error('데이터 갱신 중 오류 발생:', error);
			}
		};

		window.navigateToMap = () => {
			router.push('/child/map');
		};

		window.navigateToShopping = (missionId: string) => {
			console.log('장보기 missionId : ', missionId);
			router.push(`/child/shop/${missionId}/route`);
		};

		window.navigateToRecycling = (missionId: string) => {
			console.log('재활용 missionId : ', missionId);
			router.push(`/child/mission/${missionId}/recycle`);
		};

		window.changeRepresentativeAnimal = (animalId: number) => {
			console.log('AnimalID : ', animalId);
			if (typeof animalId === 'number' && animalId >= 0) {
				// animalId가 유효한 경우에만 실행
				console.log('대표 동물 변경 요청됨:', animalId);
				changeMainAnimal(animalId);
			} else {
				console.error('유효하지 않은 animalId:', animalId);
			}
		};

		return () => {
			delete window.UnityReadyCallback;
			delete window.RequestUserData;
			delete window.navigateToMap;
			delete window.navigateToShopping;
			delete window.navigateToRecycling;
			delete window.changeRepresentativeAnimal;
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
				}
			} else {
				console.warn('userId가 설정되지 않았습니다.');
			}
		};
		return () => {
			delete window.handleUnityShowPanel;
		};
	}, [user.userId]);

	useEffect(() => {
		console.log('와와와와와와ㅣ와ㅗ아와와', pendingData);

		if (isUnityLoaded && pendingData) {
			console.log('Unity가 로드되었고, 데이터를 전송합니다.');
			sendDataToUnity(pendingData);
			setPendingData(null);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
					isLevelUp: data.isLevelUp, // Convert boolean to 0 or 1 for Unity
					mainAnimalId: data.mainAnimalId,
					animals: data.animals,
					drawAnimalId: data.drawAnimalId,
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

	const handleUnityLoaded = useCallback(async () => {
		console.log('Unity iframe loaded, preparing to send data...');
		const getKidInfo = async () => {
			try {
				const kidData = await getUserData();
				return kidData;
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (error) {
				// setErrorMessage("")
			}
			return null;
		};

		const kidData = await getKidInfo();
		if (kidData) {
			sendDataToUnity(kidData);
		}
	}, [sendDataToUnity]);

	return (
		<div className="relative">
			<UnityViewer onUnityLoaded={handleUnityLoaded} />
		</div>
	);
}
