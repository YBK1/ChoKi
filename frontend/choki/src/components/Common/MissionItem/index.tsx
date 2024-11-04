// components/Common/MissionItem/index.tsx
import Image from 'next/image';
import shopIcon from '@/assets/icons/basket_icon.svg';
import recycleIcon from '@/assets/icons/recycling_icon.svg';
import extraMissionIcon from '@/assets/icons/other_icon.svg';

interface MissionItemProps {
	type: MissionType;
	content: string;
	onClick?: () => void;
}

const MISSION_IMAGES: Record<MissionType, string> = {
	SHOP: shopIcon,
	RECYCLE: recycleIcon,
	EXTRA_MISSION: extraMissionIcon,
};

export default function MissionItem({
	type,
	content,
	onClick,
}: MissionItemProps) {
	const image = MISSION_IMAGES[type];
	return (
		<button
			onClick={onClick}
			className="w-[330px] bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
		>
			<div className="flex items-center justify-center">
				<Image
					src={image}
					alt={content}
					width={60}
					height={60}
					className="object-contain"
				/>
			</div>
			<span className="text-lg font-medium ml-4">{content}</span>
		</button>
	);
}
