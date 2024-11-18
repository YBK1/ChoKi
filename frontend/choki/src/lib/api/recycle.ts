import axiosInstance from '@/lib/api/axiosInstance';
import axios from 'axios';

interface TempRecycleResponse {
	status: number;
	data: RecycleResponse;
	message: string;
}

export const classifyRecycle = async (
	formData: FormData,
): Promise<TempRecycleResponse> => {
	const response = await axios.post('http://localhost:5000/predict', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
	// const response = await axiosInstance.post('/ai/classify', formData, {
	// 	headers: {
	// 		'Content-Type': 'multipart/form-data',
	// 	},
	// });
	return response.data;
};

export const finishRecycle = async (formData: FormData) => {
	const response = await axiosInstance.post('/api/mission/image', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
	return response.data;
};
