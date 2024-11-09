import { getKidData } from '@/lib/api/kid';
import { useEffect, useState } from 'react';
import UnityViewer from '@/components/Unity/UnityVierwer';

export default function MainPage() {
	const [isDataSent, setIsDataSent] = useState(false); // Unity로 데이터가 전송되었는지 상태 저장
	const [errorMessage, setErrorMessage] = useState<string | null>(null); // 오류 메시지 상태 저장

	// Unity로 데이터 전송하는 함수
	const sendDataToUnity = (data: ChildMainUnityProps) => {
		const iframe = document.getElementById('unity-iframe') as HTMLIFrameElement;
		if (iframe && iframe.contentWindow) {
			const jsonData = JSON.stringify(data);
			try {
				iframe.contentWindow.postMessage(
					{ type: 'sendData', data: jsonData },
					'*',
				);
				setIsDataSent(true); // 데이터 전송 성공 상태로 설정
				setErrorMessage(null); // 오류 메시지 초기화
				console.log('Unity로 데이터가 전송되었습니다.');
			} catch (error) {
				setIsDataSent(false); // 전송 실패 상태로 설정
				setErrorMessage(`데이터 전송 중 오류 발생: ${error}`);
				console.error('Unity로 데이터 전송 중 오류 발생:', error);
			}
		} else {
			setIsDataSent(false); // iframe을 찾지 못했으므로 전송 실패
			setErrorMessage('Unity iframe을 찾을 수 없습니다.');
			console.error('Unity iframe을 찾을 수 없습니다.');
		}
	};

	// 데이터 가져오기 함수
	const getKidInfo = async () => {
		try {
			const kidData = await getKidData();
			console.log('kidData', kidData);

			// Unity로 데이터 전송
			sendDataToUnity(kidData);
		} catch (error) {
			console.error('데이터를 가져오는 중 오류 발생:', error);
		}
	};

	useEffect(() => {
		getKidInfo();
	}, []);

	return (
		<div>
			<UnityViewer />
			{isDataSent ? (
				<p>데이터가 Unity로 전송되었습니다.</p>
			) : (
				<p>데이터가 아직 전송되지 않았습니다.</p>
			)}
			{errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
		</div>
	);
}
