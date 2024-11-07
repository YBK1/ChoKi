import axiosInstance from '@/lib/api/axiosInstance';

export const saveRoute = async (
	routes: { latitude: number; longitude: number }[],
	destination: { latitude: number; longitude: number; buildingName: string },
) => {
	try {
		const requestBody = {
			destination: {
				latitude: destination.latitude,
				longitude: destination.longitude,
				buildingName: destination.buildingName,
			},
			routes: routes.map(route => ({
				latitude: route.latitude,
				longitude: route.longitude,
			})),
		};

		const response = await axiosInstance.post('/api/route', requestBody);

		return response.data;
	} catch (error) {
		console.error('경로 저장 실패핑:', error);
		throw error;
	}
};

export const getRouteList = async () => {
	try {
		const response = await axiosInstance.get('/api/route/guide/list');
		return response.data.guidedRouteList;
	} catch (error) {
		console.error('경로 목록 가져오기 실패핑:', error);
		throw error;
	}
};

export const getRouteDetails = async (guidedRouteId: string) => {
	try {
		const response = await axiosInstance.get(
			`/api/route/guide/${guidedRouteId}`,
		);
		return response.data;
	} catch (error) {
		console.error('상세 경로 정보 가져오기 실패핑:', error);
		throw error;
	}
};
