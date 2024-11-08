import axiosInstance from '@/lib/api/axiosInstance';

export const getKidData = async (): Promise<KidDataResponse> => {
	const response = await axiosInstance.get('/api/user/mypage');
	return response.data;
};
