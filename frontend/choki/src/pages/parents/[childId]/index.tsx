import MissionItem from '@/components/Common/MissionItem';
import Image from 'next/image';
import notification_icon from '@/assets/icons/notification.svg';
import Link from 'next/link';
import child_profile from '@/assets/icons/child_profile.svg';
import level_icon from '@/assets/icons/level.svg';
import mission_plus from '@/assets/icons/mission_plus.svg';

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
				<div className="flex justify-end m-4">
					<Link href="/parents/1/notification">
						<div className="bg-white rounded-xl shadow-sm flex items-center justify-center">
							<Image
								src={notification_icon}
								alt="notification"
								width={50}
								height={50}
							/>
						</div>
					</Link>
				</div>
				{/* 안내문구 */}
				<div className="text-xl font-medium mb-6 ml-10">
					<span className="font-bold">김애기</span>의 성장을 위해,
					<br />
					오늘은 어떤 심부름을 시켜볼까요?
				</div>
				{/* 아이정보 */}
				<div className="flex justify-center items-center">
					<div className="w-[330px] bg-light_yellow_dark rounded-2xl p-6 mb-8">
						<h2 className="text-lg font-bold mb-4">아이 정보</h2>
						<div className="flex justify-center items-center gap-4">
							<div className="flex flex-col">
								<Image
									src={child_profile}
									alt="child profile"
									width={80}
									height={80}
									className="rounded-full mb-4"
								/>
								<div className="flex w-[70px] bg-white rounded-lg justify-center items-center gap-1">
									<Image src={level_icon} alt="level" width={20} height={20} />
									<span className="text-sm font-bold">Lv.10</span>
								</div>
							</div>
							<div className="flex flex-col gap-1">
								<div className="flex items-center gap-2">
									<span className="text-gray-600">이름:</span>
									<span className="font-medium">김애기</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-gray-600">닉네임:</span>
									<span>일 잘하는 애기</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-gray-600 min-w-10">주소:</span>
									<span className="max-w-30 break-words">
										서울특별시 강남구 테헤란로 426
									</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-gray-600">연락처:</span>
									<span>010-1234-5678</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* 심부름 목록: 추가 버튼 누르면 모달 생성, 백엔드에게 받아온 진행중인 미션 목록 띄워주기 */}
				<div>
					<div className="flex ml-8 mb-4 gap-2">
						<h2 className="text-lg font-bold">심부름 목록</h2>
						<button className="w-6 h-6 rounded-lg shadow-sm flex items-center justify-center">
							<Image
								src={mission_plus}
								alt="mission_plus"
								// onClick={}
							/>
						</button>
					</div>
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
