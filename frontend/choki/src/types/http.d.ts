//Response 뒤에 붙이기

// interface BaseResponse<T> {
// 	status: number;
// 	message: string;
// 	data: T;
// }

interface NotificationResponse {
	childId: number;
	content: string;
	type: MissionType;
	id: number;
	time: string;
}
