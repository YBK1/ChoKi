import axiosInstance from '@/lib/api/axiosInstance';

export const getKidData = async (): Promise<UnityMainResponse> => {
	const response = await axiosInstance.get('/api/user/child');
	return response.data;
};
