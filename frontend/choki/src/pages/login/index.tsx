import React, { useState } from 'react';
import CommonButton from '@/components/Common/Button';
import CommonInput from '@/components/Common/Input';
import Image from 'next/image';
import MainLogo from '@/assets/icons/choki_icon.svg';

export default function LoginPage() {
	const [id, setId] = useState('');
	const [password, setPassword] = useState('');
	const handleLogin = () => {
		// TODO - 로그인 로직 구현
	};
	return (
		<div className="bg-light_yellow_mid flex flex-col items-center h-screen">
			<div className="w-[120px] h-[120px] mb-16">
				<Image src={MainLogo} alt="Choki Logo" width={120} height={120} />
			</div>

			{/* Form Container */}
			<div className="w-full max-w-[316px] space-y-4">
				{/* Input Fields */}
				<div className="space-y-4">
					<CommonInput
						placeholder="아이디"
						value={id}
						onChange={e => setId(e.target.value)}
					/>
					<CommonInput
						placeholder="비밀번호"
						value={password}
						onChange={e => setPassword(e.target.value)}
					/>
				</div>

				{/* Login Button */}
				<div className="pt-4">
					<CommonButton
						onClick={handleLogin}
						size="large"
						color="orange"
						text="로그인"
					></CommonButton>
				</div>
			</div>

			{/* Sign Up Link */}
			<button
				className="mt-4 text-gray-600 hover:text-gray-800"
				onClick={() => {
					/* 회원가입 페이지로 이동 */
				}}
			>
				아이디가 없으신가요?
			</button>
		</div>
	);
}
