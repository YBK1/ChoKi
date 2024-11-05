// 회원가입
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL;
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
	try {
		const response = await axios.post(`${baseURL}/api/register`, {
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
	} catch (error) {
		console.error('Error registering user:', error);
		throw error;
	}
};
