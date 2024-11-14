import { useRouter } from 'next/router';
import Image from 'next/image';
import { MISSION_IMAGES } from '@/constants/mission';

interface MissionListProps {
	missionId: string;
	completedAt: string;
	image: string;
	type: string;
}

const MissionList: React.FC<MissionListProps> = ({
	missionId,
	completedAt,
	image,
	type,
}) => {
	const router = useRouter();
	const handleMissionDetail = () => {
		router.push(`${missionId}`);
	};
	return (
		<div className="flex flex-col items-center">
			<div
				className="relative w-40 aspect-square mb-2 cursor-pointer"
				onClick={handleMissionDetail}
			>
				<div className="absolute inset-0 bg-white rounded-3xl shadow-sm">
					<div
						className={
							'absolute -top-1 -left-1 z-10 flex items-center justify-center w-8 h-8 rounded-full'
						}
					>
						<div className="relative w-5 h-5">
							<Image
								src={MISSION_IMAGES[type as MissionType]}
								alt={`${type} icon`}
								fill
								className="object-contain"
							/>
						</div>
					</div>

					<div className="relative w-[160px] h-[180px] bg-grey-100 rounded-3xl overflow-hidden">
						<Image
							src={image}
							alt="Mission image"
							fill
							className="object-cover"
						/>
					</div>
				</div>
			</div>

			<span className="text-sm text-gray-600">{completedAt}</span>
		</div>
	);
};
export default MissionList;
