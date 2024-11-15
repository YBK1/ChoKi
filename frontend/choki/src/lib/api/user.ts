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
	console.log('내 정보 조회');
	return response.data;
};

export const getMissionList = async (userId: number) => {
	const response = await axiosInstance.get('/api/mission/inProgress', {
		params: {
			userId: userId,
		},
	});
	return response.data;
};

export const getUsersNearby = async () => {
	const response = await axiosInstance.get('/api/user/nearby');
	return response.data;
};
