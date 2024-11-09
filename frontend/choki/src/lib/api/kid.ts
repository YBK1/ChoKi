import axiosInstance from '@/lib/api/axiosInstance';

export const getKidData = async (): Promise<KidDataResponse> => {
	const response = await axiosInstance.get('/api/user/mypage');
	return response.data;
};

//장보가 물품 비교
export const compareItems = async ({
	originBarcode,
	inputBarcode,
}: CompareItemsRequest) => {
	const response = await axiosInstance.post(`/api/shopping/item/compare`, {
		originBarcode,
		inputBarcode,
	});

	console.log('compareItems response:', response);
	return response.data;
};
