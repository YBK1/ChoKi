import { useRouter } from 'next/router';
import Image from 'next/image';
import previous_icon from '@/assets/icons/previous.svg';
import { MISSION_IMAGES } from '@/constants/mission';
import right_arrow from '@/assets/icons/right_arrow.svg';
import { parentWebSocketClient } from '@/lib/ws/socketUtils';
import * as StompJs from '@stomp/stompjs';
export default function NotificationPage() {
	const router = useRouter();

	const notifications: NotificationResponse[] = [
		{
			childId: 2,
			content: '아이가 장보기를 시작했어요!',
			type: 'SHOP',
			id: 1,
			time: '24.07.01 08:02',
		},
		{
			childId: 2,
			content: '아이가 재활용 미션을 완료했어요! 미션 내용을 확인해보세요!',
			type: 'RECYCLE',
			id: 2,
			time: '24.07.01 08:03',
		},
		{
			childId: 2,
			content: '아이가 추가 미션을 완료했어요! 미션 내용을 확인해보세요!',
			type: 'EXTRA_MISSION',
			id: 3,
			time: '24.07.01 08:02',
		},
	];

	const handleWebSocket = () => {
		parentWebSocketClient.connect();

		parentWebSocketClient.subscribe(
			`/sub/shopping/672df1def4c5cb7ca5d36532`,
			(msg: StompJs.Message) => {
				console.log('Received message:', msg.body);
			},
		);
		return () => {
			console.log('Disconnecting from WebSocket...');
			parentWebSocketClient.disconnect();
		};
	};
	const handleGoBack = () => {
		router.back();
	};

	return (
		<div className="flex flex-col w-full max-w-md mx-auto bg-light_yellow min-h-screen">
			<Image
				src={previous_icon}
				alt="previous_icon"
				className="w-12 h-12 m-4 cursor-pointer"
				onClick={handleGoBack}
			/>

			{/* 알림목록 */}
			<div className="flex flex-col gap-4 p-4">
				{notifications.map(notification => (
					<div
						key={notification.id}
						className="flex items-center p-4 shadow-sm"
					>
						<div className="relative flex items-center justify-center min-w-[60px] min-h-[60px]">
							<Image
								src={MISSION_IMAGES[notification.type]}
								alt={notification.type}
								width={60}
								height={60}
								className="object-contain"
							/>
						</div>

						<div className="flex flex-col ml-4 flex-grow">
							<span className="text-base">{notification.content}</span>
							<span className="text-sm text-gray-400">{notification.time}</span>
						</div>
						<div className="min-w-[24px] min-h-[24px]">
							<Image
								src={right_arrow}
								alt="detail"
								width={24}
								height={24}
								onClick={handleWebSocket}
							/>
						</div>
					</div>
				))}
			</div>

			{/* 하단 네비게이션... */}
		</div>
	);
}
