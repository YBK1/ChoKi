import { useState } from 'react';
import CommonButton from '@/components/Common/Button';
import CommonInput from '@/components/Common/Input';
import SearchIcon from '@/../public/icons/search_icon.png';
import { useRouter } from 'next/router';
import BackIcon from '@/assets/icons/back_icon.svg';
import Image from 'next/image';
interface PasswordForm {
	password: string;
	passwordConfirm: string;
	isMatch: boolean;
	message: string;
}

export default function SignupPage() {
	const [id, setId] = useState<string>('');
	const [passwordForm, setPasswordForm] = useState<PasswordForm>({
		password: '',
		passwordConfirm: '',
		isMatch: true,
		message: '',
	});
	const [isParent, setIsParent] = useState<boolean>(true); // 부모/자녀 토글 상태 관리
	const [nickname, setNickname] = useState<string>('');
	const [address, setAddress] = useState<string>('');
	const [phone, setPhone] = useState<string>('');
	const Router = useRouter();
	const handleSignup = () => {
		// TODO - 회원가입 로직 구현
		Router.push({
			pathname: '/signup/done',
			query: { isParent: isParent },
		});
	};
	// 필드 이름을 매개변수로 받아서 해당 필드를 업데이트하는 함수
	const handlePasswordChange =
		(field: 'password' | 'passwordConfirm') =>
		(e: React.ChangeEvent<HTMLInputElement>): void => {
			const { value } = e.target;

			setPasswordForm(prev => {
				const newForm = { ...prev, [field]: value };

				if (newForm.passwordConfirm !== '') {
					const isMatch = newForm.password === newForm.passwordConfirm;
					return {
						...newForm,
						isMatch,
						message: isMatch ? '' : '비밀번호가 일치하지 않습니다.',
					};
				}
				return newForm;
			});
		};

	return (
		<div className="bg-light_yellow_mid flex flex-col items-center h-screen px-4 py-6 gap-8">
			<div className="flex items-center justify-center w-full relative mb-8">
				<Image
					src={BackIcon}
					alt="Back Icon"
					className="w-6 h-6 cursor-pointer absolute left-0"
					onClick={() => window.history.back()}
				/>
				<h1 className="text-2xl font-bold">회원가입</h1>
			</div>

			<CommonInput
				type="text"
				placeholder="아이디"
				value={id}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					setId(e.target.value)
				}
			/>

			<div className="relative">
				<CommonInput
					type="password"
					placeholder="비밀번호"
					value={passwordForm.password}
					onChange={handlePasswordChange('password')}
				/>
				{/* {passwordForm.isMatch && passwordForm.password && (
					// <CheckIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 text-orange-500" />
				)} */}
			</div>

			<div className="relative">
				<CommonInput
					type="password"
					placeholder="비밀번호 확인"
					value={passwordForm.passwordConfirm}
					onChange={handlePasswordChange('passwordConfirm')}
				/>
				{/* {passwordForm.isMatch && passwordForm.passwordConfirm && (
					// <CheckIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 text-orange-500" />
				)} */}
			</div>

			<div className="flex w-[315px]">
				<button
					onClick={() => setIsParent(true)}
					className={`flex-1 py-2 rounded-l-full ${
						isParent ? 'bg-orange_main text-white' : 'bg-white'
					}`}
				>
					부모
				</button>
				<button
					onClick={() => setIsParent(false)}
					className={`flex-1 py-2 rounded-r-full ${
						!isParent ? 'bg-orange_main  text-white' : 'bg-white'
					}`}
				>
					자녀
				</button>
			</div>

			<CommonInput
				type="text"
				placeholder="닉네임"
				value={nickname}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					setNickname(e.target.value)
				}
			/>

			<div className="relative">
				<CommonInput
					type="text"
					placeholder="주소"
					value={address}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setAddress(e.target.value)
					}
				/>

				<Image
					src={SearchIcon}
					alt="Search Icon"
					className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
				/>
			</div>

			<CommonInput
				type="text"
				placeholder="전화번호"
				value={phone}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					setPhone(e.target.value)
				}
			/>
			<div className="mt-8">
				<CommonButton
					color="orange"
					size="large"
					text="가입하기"
					onClick={handleSignup}
				/>
			</div>
		</div>
	);
}
