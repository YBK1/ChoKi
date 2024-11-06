import axiosInstance from './axiosInstance';

export const createInviteCode = async (): Promise<InviteCodeResponse> => {
	const response = await axiosInstance.post('/api/family');
	return response.data;
};
