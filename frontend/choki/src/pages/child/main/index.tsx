// import { getMissionList } from '@/lib/api/user';
import { getUserData } from '@/lib/api/user';
import { useCallback, useEffect, useState } from 'react';
import UnityViewer from '@/components/Unity/UnityViewer';
// import { userAtom } from '@/atoms';
// import { useAtom } from 'jotai';
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
		) => Promise<any>;
	}
}

export default function MainPage() {
	const [, setIsUnityLoaded] = useState(false); // Unity 로드 상태
	// const [user] = useAtom(userAtom); // Jotai의 유저 상태
	const [userData, setUserData] = useState<userDataResponse | null>(null); // 사용자 데이터 상태

	// spring에서 데이터를 가져와서 set하는 함수
	const getData = async () => {
		console.log('Unity가 로드된 후 getUserData 호출 시작');
		const kidData = await getUserData(); // 사용자 데이터 가져오기
		console.log('getUserData 완료:', kidData);
		setUserData(kidData); // 상태에 저장
		sendDataToUnity(kidData); // Unity로 데이터 전달
	};

	// Unity가 완전히 로드된 후 사용자 데이터를 가져오고 Unity로 전달
	const fetchAndSendUserData = useCallback(async () => {
		try {
			getData();
		} catch (error) {
			console.error('getUserData 호출 중 오류:', error);
		}
	}, []);

	const sendDataToUnity = useCallback((data: userDataResponse) => {
		const iframe = document.getElementById('unity-iframe') as HTMLIFrameElement;
		if (iframe?.contentWindow?.unityInstance) {
			const unityData: ToUnityData = {
				userId: data.userId,
				nickname: data.nickname,
				level: data.level,
				exp: data.exp,
				isLevelUp: data.isLevelUp,
				mainAnimalId: data.mainAnimalId,
				animals: data.animals,
				drawAnimalId: data.drawAnimalId,
			};
			const jsonData = JSON.stringify(unityData);
			try {
				iframe.contentWindow.unityInstance.SendMessage(
					'DataReceiver',
					'receiveDataFromUnity',
					jsonData,
				);
				console.log('Data sent to Unity:', unityData);
			} catch (error) {
				console.error('Unity로 데이터 전송 중 오류:', error);
			}
		} else {
			console.error('iframe 또는 unityInstance가 정의되지 않았습니다.');
		}
	}, []);

	// Unity 관련 글로벌 이벤트 설정
	useEffect(() => {
		window.UnityReadyCallback = () => {
			console.log('Unity가 완전히 로드되었습니다.');
			setIsUnityLoaded(true); // Unity 로드 완료
			fetchAndSendUserData(); // Unity가 로드된 후 데이터 가져오기 및 전달
		};

		window.RequestUserData = async () => {
			console.log('Unity에서 데이터 갱신 요청');
			if (userData) {
				sendDataToUnity(userData); // 이미 로드된 데이터를 Unity로 재전송
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
	}, [fetchAndSendUserData, userData, sendDataToUnity]);

	return (
		<div className="relative">
			<UnityViewer
				onUnityLoaded={() => {
					console.log('Unity Loaded 이벤트 발생');
				}}
			/>
		</div>
	);
}
