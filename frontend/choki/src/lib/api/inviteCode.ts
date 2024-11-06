import axiosInstance from './axiosInstance';

// 초대 코드 생성
export const createInviteCode = async (): Promise<InviteCodeResponse> => {
	const response = await axiosInstance.post('/api/family');
	return response.data;
};

// 초대 코드 조회
export const getInviteCode = async (): Promise<InviteCodeResponse> => {
	const response = await axiosInstance.get('/api/family/invite-code');
	return response.data;
};
