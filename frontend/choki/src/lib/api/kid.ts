import axiosInstance from '@/lib/api/axiosInstance';

export const getKidData = async (): Promise<MissionListResponse> => {
	const response = await axiosInstance.get('/api/user/mypage');
	return response.data;
};
