import { useState } from 'react';
import CommonButton from '@/components/Common/Button';
import CommonInput from '@/components/Common/Input';

export default function SignupPage() {
	const [id, setId] = useState('');
	const [passwordForm, setPasswordForm] = useState<PasswordForm>({
		password: '',
		passwordConfirm: '',
		isMatch: true,
		message: '',
	});

	// 필드 이름을 매개변수로 받아서 해당 필드를 업데이트하는 함수
	const handlePasswordChange =
		(field: 'password' | 'passwordConfirm') =>
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const { value } = e.target;

			setPasswordForm(prev => {
				const newForm = { ...prev, [field]: value };

				// 비밀번호 확인이 비어있지 않을 때만 검증
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
		<div className="bg-light_yellow_mid flex flex-col items-center h-screen pt-[20vh]">
			<CommonInput
				type="text"
				placeholder="아이디"
				value={id}
				onChange={e => setId(e.target.value)}
			/>
			<CommonInput
				type="password"
				placeholder="비밀번호"
				value={passwordForm.password}
				onChange={handlePasswordChange('password')}
			/>
			<CommonInput
				type="password"
				placeholder="비밀번호 확인"
				value={passwordForm.passwordConfirm}
				onChange={handlePasswordChange('passwordConfirm')}
			/>
			<CommonButton color="orange" size="large" text="가입하기" />
		</div>
	);
}
