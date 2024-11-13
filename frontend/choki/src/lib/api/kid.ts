import axiosInstance from '@/lib/api/axiosInstance';
import axios from 'axios';

export const getKidData = async (): Promise<KidDataResponse> => {
	const response = await axiosInstance.get('/api/user/mypage');
	return response.data;
};

export const classifyRecycle = async (
	formData: FormData,
): Promise<RecycleResponse> => {
	const response = await axios.post(
		'http://localhost:5000/ai/classify',
		formData,
		{
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		},
	);
	// const response = await axiosInstance.post('/ai/classify', formData, {
	// 	headers: {
	// 		'Content-Type': 'multipart/form-data',
	// 	},
	// });
	return response.data;
};
