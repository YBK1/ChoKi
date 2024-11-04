import MissionItem from '@/components/Common/MissionItem';

export default function index() {
	// 임의 데이터
	// Mission 타입 지정
	const missions: Mission[] = [
		{ type: 'SHOP', content: '동네 마트 장보기' },
		{ type: 'RECYCLE', content: '재활용 분리수거하기' },
		{ type: 'EXTRA_MISSION', content: '양치하기' },
	];

	return (
		<>
			<div className="flex flex-col w-full max-w-md mx-auto bg-light_yellow background min-h-screen">
				{/* 알림 아이콘: 누르면 parents/${childId}/notification으로 이동 */}
				{/* 안내문구 */}
				{/* 아이정보 */}
				{/* 심부름 목록: 추가 버튼 누르면 모달 생성, 백엔드에게 받아온 진행중인 미션 목록 띄워주기 */}
				<div>
					<div className="flex flex-col justify-center items-center">
						{missions.map((mission, index) => (
							<MissionItem
								key={index}
								type={mission.type}
								content={mission.content}
								onClick={() =>
									console.log(`Clicked mission: ${mission.content}`)
								}
							/>
						))}
					</div>
				</div>
			</div>
		</>
	);
}
