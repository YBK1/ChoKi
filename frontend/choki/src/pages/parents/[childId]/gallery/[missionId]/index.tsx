import { useState, useEffect } from 'react';
import Image from 'next/image';
import MissionItem from '@/components/Common/MissionItem';
import BottomNavbar from '@/components/Common/Navbar/BottomNavbar';
import { getMissionDetail } from '@/lib/api/mission';
import { useRouter } from 'next/router';

export default function GalleryDetailPage() {
	const router = useRouter();
	const { missionId } = router.query;
	const [missionDetail, setMissionDetail] =
		useState<MissionDetailResponse | null>(null);

	useEffect(() => {
		const fetchMissionDetail = async () => {
			if (missionId) {
				try {
					const response = await getMissionDetail(missionId as string);
					console.log(response);
					setMissionDetail(response);
				} catch (error) {
					console.error('Failed to fetch mission detail:', error);
				}
			}
		};

		fetchMissionDetail();
	}, [missionId]);

	if (!missionDetail) return;

	return (
		<>
			<div className="flex flex-col w-full max-w-md mx-auto bg-light_yellow min-h-screen pb-10">
				<div className="flex items-center p-4 border-b relative mt-3">
					<button onClick={() => router.back()} className="p-2 absolute left-4">
						<Image
							src="/icons/previous_nav.svg"
							alt="back"
							width={24}
							height={24}
						/>
					</button>
					<h1 className="w-full text-center text-xl font-bold">
						{missionDetail.completedAt?.split('T')[0].replace(/-/g, '.')}
					</h1>
				</div>

				<div className="flex justify-center mt-6">
					<MissionItem
						type={missionDetail.type as MissionType}
						content={missionDetail.content}
					/>
				</div>

				<div className="flex justify-center items-center mt-5">
					<div className="w-[330px] h-[330px] rounded-2xl bg-gray-100">
						<div className="w-full h-full rounded-lg overflow-hidden flex items-center justify-center">
							{missionDetail.image && (
								<Image
									src={missionDetail.image}
									alt="Mission completed"
									width={280}
									height={280}
									className="rounded-lg object-cover"
								/>
							)}
						</div>
					</div>
				</div>

				<div className="flex flex-col ml-10">
					<div className="text-lg font-bold mt-8 mb-2">한마디</div>
					<div className="w-[310px] p-3 min-h-[20px] rounded-3xl border-2 border-gray-300 bg-gray-50">
						{missionDetail.comment || '작성된 코멘트가 없습니다.'}
					</div>
				</div>
			</div>
			<BottomNavbar />
		</>
	);
}
