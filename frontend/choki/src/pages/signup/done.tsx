import { useRouter } from 'next/router';
import InviteCodeModal from '@/components/Common/Modal/inviteCodeModal';
import CommonButton from '@/components/Common/Button';
import DogCharacter from '@/assets/icons/dog_character.svg';
import Image from 'next/image';

export default function DonePage() {
	const router = useRouter();
	const isParent = router.query.isParent === 'true'; // 문자열을 boolean으로 명시적 변환

	return (
		<div className="bg-light_yellow_mid flex flex-col items-center h-screen px-4 py-6 gap-8">
			<InviteCodeModal>
				<div className="flex flex-col items-center gap-4 mt-12">
					<h1 className="text-3xl font-bold">회원가입 완료!</h1>

					<div className="w-32 h-32 relative">
						<Image
							src={DogCharacter}
							alt="강아지 캐릭터"
							layout="fill"
							objectFit="contain"
						/>
					</div>
					<p className="text-center text-lg mt-4">
						{isParent ? (
							<>
								이제 아이와 연결하여
								<br />
								심부름을 보내보세요!
							</>
						) : (
							<>
								이제 부모님과 연결하여
								<br />
								심부름을 받아보세요!
							</>
						)}
					</p>
					<CommonButton
						size="medium"
						color="white"
						onClick={() => {}}
						text={isParent ? '초대코드 생성' : '초대코드 입력'}
					/>
				</div>
			</InviteCodeModal>
		</div>
	);
}
