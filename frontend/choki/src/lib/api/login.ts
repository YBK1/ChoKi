import axios from 'axios';
import qs from 'qs';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

// 회원가입
export const registerUser = async ({
	userId,
	userPassword,
	nickname,
	address,
	latitude,
	longitude,
	name,
	tel,
	role,
}: SignupRequest) => {
	const response = await axios.post(`${baseURL}/api/user/signup`, {
		userId,
		userPassword,
		nickname,
		address,
		latitude,
		longitude,
		name,
		tel,
		role,
	});
	return response.data;
};

// 로그인
export const loginUser = async ({
	userId,
	userPassword,
}: LoginRequest): Promise<LoginResponse> => {
	console.log('loginUser', userId, userPassword);

	// 데이터를 URL 인코딩된 문자열로 변환
	const data = qs.stringify({
		username: userId,
		password: userPassword,
	});

	// axios 요청에 URL 인코딩된 데이터와 헤더를 설정
	try {
		const response = await axios.post(`${baseURL}/api/user/login`, data, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		});
		console.log('loginUser response', response);

		// response.data를 LoginResponse 타입으로 반환
		return response.data.data as LoginResponse;
	} catch (error) {
		console.error('Error in loginUser:', error);
		throw error;
	}
};
