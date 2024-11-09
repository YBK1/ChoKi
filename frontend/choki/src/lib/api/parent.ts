import axiosInstance from '@/lib/api/axiosInstance';

export const getKidDataFromParent = async (
	childId: number,
): Promise<KidDataResponseFromParent> => {
	const response = await axiosInstance.get(`/api/family/info/${childId}`);
	console.log(response.data);
	return response.data;
};
