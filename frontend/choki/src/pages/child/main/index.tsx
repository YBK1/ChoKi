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

	useEffect(() => {
		getKidInfo();
	}, []);

	return <UnityViewer />;
}
