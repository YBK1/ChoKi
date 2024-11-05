//Response 뒤에 붙이기

// export interface BaseResponse<T> {
// 	status: number;
// 	message: string;
// 	data: T;
// }

export interface NotificationResponse {
	childId: number;
	content: string;
	type: MissionType;
	id: number;
	time: string;
}
