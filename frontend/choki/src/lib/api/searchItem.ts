import axiosInstance from '@/lib/api/axiosInstance';
const baseURL = process.env.NEXT_PUBLIC_API_URL;
// const baseURL = 'https://choki.co.kr';

// 상품 검색 API
export const searchItem = async (
	itemName: string,
	page: number,
	size: number,
): Promise<ItemSearchResponse[]> => {
	try {
		const response = await axiosInstance.post(
			`${baseURL}/api/shopping/item/search`,
			{
				itemName,
				page,
				size,
			},
		);
		return response.data;
	} catch (error) {
		console.error('Error in searchItem:', error);
		throw error;
	}
};
