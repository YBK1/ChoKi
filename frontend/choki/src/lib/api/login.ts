import axios from 'axios';

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
export const loginUser = async ({ userId, userPassword }: LoginRequest) => {
	const response = await axios.post(`${baseURL}/api/user/login`, {
		userId,
		userPassword,
	});
	return response.data;
};
