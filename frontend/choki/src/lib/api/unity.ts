import axiosInstance from '@/lib/api/axiosInstance';

export const getKidData = async (): Promise<UnityMainResponse> => {
	const response = await axiosInstance.get('/api/user/child');
	return response.data;
};

export const changeMainAnimal = async (animalId: number): Promise<void> => {
	try {
		await axiosInstance.put(`/api/collected/animal/${animalId}/main`);
	} catch (error) {
		console.error('Error in changing main animal:', error);
		throw error;
	}
};
