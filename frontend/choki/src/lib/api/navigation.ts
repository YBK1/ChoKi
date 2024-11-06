import axios from 'axios';

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

		const response = await axios.post(
			`${process.env.NEXT_PUBLIC_API_URL}/api/route/save`,
			requestBody,
		);

		return response.data;
	} catch (error) {
		console.error('경로 저장 실패핑:', error);
		throw error;
	}
};
