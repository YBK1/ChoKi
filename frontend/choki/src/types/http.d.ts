//http 관련 타입, Request, Response 뒤에 붙이기

type role = 'PARENT' | 'CHILD';
interface SignupRequest {
	userId: 'string';
	userPassword: 'string';
	nickname: 'string';
	address: 'string';
	latitude: 0;
	longitude: 0;
	name: 'string';
	tel: 'string';
	role: role;
}
