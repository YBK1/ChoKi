//http 관련 타입, Request, Response 뒤에 붙이기

type role = 'PARENT' | 'CHILD';
interface SignupRequest {
	userId: string;
	userPassword: string;
	nickname: string;
	address: string;
	latitude: number;
	longitude: number;
	name: string;
	tel: string;
	role: role;
}

interface LoginRequest {
	userId: string;
	userPassword: string;
}
