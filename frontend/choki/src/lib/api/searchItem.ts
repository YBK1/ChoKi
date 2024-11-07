import axiosInstance from '@/lib/api/axiosInstance';
const baseURL = process.env.NEXT_PUBLIC_API_URL;

// 상품 검색 API
export const searchItem = async (
	itemName: string,
): Promise<ItemSearchResponse> => {
	try {
		const response = await axiosInstance.get(`${baseURL}/api/shopping/item`, {
			params: { itemName },
		});
		return response.data;
	} catch (error) {
		console.error('Error in searchItem:', error);
		throw error;
	}
};
