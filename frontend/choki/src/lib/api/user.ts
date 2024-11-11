import axiosInstance from '@/lib/api/axiosInstance';
const baseURL = process.env.NEXT_PUBLIC_API_URL;

// 가족 자녀 조회
export const getFamily = async () => {
	try {
		const response = await axiosInstance.get(`${baseURL}/api/family/info`);
		return response.data;
	} catch (error) {
		console.error('Error in family:', error);
		throw error;
	}
};

export const getUserData = async (): Promise<userDataResponse> => {
	const response = await axiosInstance.get('/api/user/mypage');
	return response.data;
};
