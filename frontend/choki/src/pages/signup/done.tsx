import { useRouter } from 'next/router';
import {
	useState,
	useRef,
	KeyboardEvent,
	ClipboardEvent,
	useEffect,
} from 'react';
import InviteCodeModal from '@/components/Common/Modal/nonCloseModal';
import CommonButton from '@/components/Common/Button';
import DogCharacter from '@/assets/icons/dog_character.svg';
import Image from 'next/image';

const Toast = ({ message }: { message: string }) => (
	<div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 animate-fade-up">
		<div className="bg-black bg-opacity-80 text-white px-6 py-3 rounded-full shadow-lg">
			{message}
		</div>
	</div>
);

export default function DonePage() {
	const router = useRouter();
	const isParent = router.query.isParent === 'true';
	const [doneStep, setDonStep] = useState(0);
	const [inviteCode] = useState('123456');
	const [showToast, setShowToast] = useState(false);
	const [code, setCode] = useState(['', '', '', '', '', '']); // 6자리 코드
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	const handleInviteCode = () => {
		setDonStep(1);
	};
	useEffect(() => {
		if (!isParent && doneStep === 1) {
			inputRefs.current[0]?.focus();
		}
	}, [isParent, doneStep]);
	const handleCopyCode = async () => {
		try {
			await navigator.clipboard.writeText(inviteCode);
			setShowToast(true);
			setTimeout(() => {
				setShowToast(false);
			}, 2000);
		} catch (err) {
			console.error('복사 실패:', err);
		}
	};

	// 각 입력칸 처리
	const handleChange = (index: number, value: string) => {
		if (value.length <= 1) {
			const newCode = [...code];
			newCode[index] = value;
			setCode(newCode);

			// 입력 후 다음 칸으로 포커스 이동
			if (value !== '' && index < code.length - 1) {
				inputRefs.current[index + 1]?.focus();
			}
		}
	};

	// 백스페이스 처리
	const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Backspace' && !code[index] && index > 0) {
			const newCode = [...code];
			newCode[index - 1] = '';
			setCode(newCode);
			inputRefs.current[index - 1]?.focus();
		}
	};

	// 붙여넣기 처리
	const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
		e.preventDefault();
		const pastedData = e.clipboardData.getData('text').slice(0, code.length);
		const newCode = [...code];

		pastedData.split('').forEach((char, index) => {
			if (index < code.length) {
				newCode[index] = char;
			}
		});

		setCode(newCode);
	};

	if (doneStep === 0) {
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
							color={isParent ? 'white' : 'orange'}
							onClick={handleInviteCode}
							text={isParent ? '초대코드 생성' : '초대코드 입력'}
						/>
					</div>
				</InviteCodeModal>
			</div>
		);
	} else if (doneStep === 1) {
		return (
			<div className="bg-light_yellow_mid flex flex-col items-center h-screen px-4 py-6 gap-8">
				<InviteCodeModal>
					<div className="flex flex-col items-center gap-4 mt-12">
						<h4 className="text-2xl font-bold">
							{isParent ? (
								<>초대 코드를 공유해주세요!</>
							) : (
								<>초대코드를 입력해주세요!</>
							)}
						</h4>

						<div className="w-32 h-32 relative">
							<Image
								src={DogCharacter}
								alt="강아지 캐릭터"
								layout="fill"
								objectFit="contain"
							/>
						</div>

						{isParent ? (
							<div className="relative">
								<h1 className="text-2xl">{inviteCode}</h1>
							</div>
						) : (
							<div className="flex gap-2 justify-center w-full px-8">
								{code.map((digit, index) => (
									<input
										key={index}
										ref={(el: HTMLInputElement | null) => {
											inputRefs.current[index] = el;
										}}
										type="text"
										maxLength={1}
										value={digit}
										onChange={e => handleChange(index, e.target.value)}
										onKeyDown={e => handleKeyDown(index, e)}
										onPaste={handlePaste}
										className="w-8 h-12 border-b-2 border-gray-300 text-center text-xl focus:border-orange_main focus:outline-none bg-transparent"
									/>
								))}
							</div>
						)}

						<CommonButton
							size="medium"
							color="orange"
							onClick={isParent ? handleCopyCode : handleInviteCode}
							text={isParent ? '복사하기' : '완료'}
						/>

						{isParent && (
							<CommonButton
								size="medium"
								color="white"
								onClick={() => router.push('/parents')}
								text="메인 페이지로 이동"
							/>
						)}
					</div>
				</InviteCodeModal>
				{showToast && <Toast message="복사되었습니다!" />}
			</div>
		);
	}
}
